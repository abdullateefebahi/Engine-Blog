"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const commentSchema = z.object({
    postSlug: z.string().min(1, "Post slug is required"),
    userName: z.string().min(1, "Username is required").max(100),
    userAvatar: z.string().nullable().optional(),
    comment: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
    parentId: z.number().nullable().optional(),
});

const reactionSchema = z.object({
    postSlug: z.string().min(1),
    reaction: z.string().min(1),
    guestId: z.string().nullable().optional(),
});

const toggleReactionSchema = z.object({
    postSlug: z.string().min(1),
    reaction: z.string().min(1),
    commentId: z.number().nullable().optional(),
    guestId: z.string().nullable().optional(),
});

const bookmarkSchema = z.object({
    postSlug: z.string().min(1),
});

const followSchema = z.object({
    followingId: z.string().min(1),
});

export async function addCommentAction({
    postSlug,
    userName,
    userAvatar,
    comment,
    parentId = null,
}: {
    postSlug: string;
    userName: string;
    userAvatar: string | null;
    comment: string;
    parentId?: number | null;
}) {
    // Validate input
    const result = commentSchema.safeParse({
        postSlug,
        userName,
        userAvatar,
        comment,
        parentId,
    });

    if (!result.success) {
        throw new Error("Invalid input: " + result.error.issues.map((e) => e.message).join(", "));
    }
    const { userId } = await auth();
    const effectiveUserId = userId || "guest";
    console.log("Server Action: addCommentAction called. effectiveUserId:", effectiveUserId);

    console.log("Server Action: Attempting insert to 'comments' table for:", { postSlug, userName, parentId });

    const { data, error } = await supabaseAdmin.from("comments").insert([
        {
            post_slug: postSlug,
            parent_id: parentId,
            user_name: userName,
            user_id: effectiveUserId,
            user_avatar: userAvatar,
            comment,
            is_approved: true, // Auto-approve for verified users
        },
    ]).select(); // .select() is important to return the data!

    if (error) {
        console.error("Server Action: Supabase Insert Error:", error);
        throw new Error("Failed to add comment: " + error.message);
    }

    console.log("Server Action: Insert successful:", data);
    return data;
}

export async function addReactionAction({
    postSlug,
    reaction,
    guestId,
}: {
    postSlug: string;
    reaction: string;
    guestId?: string | null;
}) {
    const result = reactionSchema.safeParse({ postSlug, reaction, guestId });
    if (!result.success) throw new Error("Invalid Input");
    const { userId } = await auth();
    const finalUserId = userId || guestId;

    if (!finalUserId) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabaseAdmin.from("reactions").insert([
        {
            post_slug: postSlug,
            user_id: finalUserId,
            reaction,
        },
    ]).select();

    if (error) {
        console.error("Error adding reaction:", error);
        throw new Error("Failed to add reaction");
    }

    revalidatePath(`/posts/${postSlug}`);
    return data;
}

export async function removeReactionAction({
    postSlug,
    reaction,
    guestId,
}: {
    postSlug: string;
    reaction: string;
    guestId?: string | null;
}) {
    const result = reactionSchema.safeParse({ postSlug, reaction, guestId });
    if (!result.success) throw new Error("Invalid Input");
    const { userId } = await auth();
    const finalUserId = userId || guestId;

    if (!finalUserId) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabaseAdmin
        .from("reactions")
        .delete()
        .eq("post_slug", postSlug)
        .eq("user_id", finalUserId)
        .eq("reaction", reaction)
        .select();

    if (error) {
        console.error("Error removing reaction:", error);
        throw new Error("Failed to remove reaction");
    }

    revalidatePath(`/posts/${postSlug}`);
    return data;
}

export async function deleteCommentAction(commentId: number) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Secure delete: Only delete if the ID matches AND the user_id matches the logged-in user
    const { data, error } = await supabaseAdmin
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId)
        .select();

    if (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete comment");
    }

    if (data.length === 0) {
        // This means no row was deleted, likely because user_id didn't match (not owner)
    }

    return data;
}
export async function toggleReactionAction({
    postSlug,
    reaction,
    commentId = null,
    guestId,
}: {
    postSlug: string;
    reaction: string;
    commentId?: number | null;
    guestId?: string | null;
}) {
    const result = toggleReactionSchema.safeParse({ postSlug, reaction, commentId, guestId });
    if (!result.success) throw new Error("Invalid Input");

    const { userId } = await auth();
    const finalUserId = userId || guestId;

    if (!finalUserId) {
        throw new Error("Unauthorized: Login or guest ID required");
    }

    // Check if reaction already exists
    let query = supabaseAdmin
        .from("reactions")
        .select("*")
        .eq("user_id", finalUserId)
        .eq("reaction", reaction);

    if (commentId) {
        query = query.eq("comment_id", commentId);
    } else {
        query = query.eq("post_slug", postSlug).is("comment_id", null);
    }

    const { data: existing, error: queryError } = await query;

    if (queryError) {
        console.error("toggleReactionAction: Query error", queryError);
        throw new Error("Failed to check existing reaction");
    }

    if (existing && existing.length > 0) {
        // Remove reaction
        const { error: deleteError } = await supabaseAdmin
            .from("reactions")
            .delete()
            .eq("id", existing[0].id);

        if (deleteError) {
            console.error("toggleReactionAction: Delete error", deleteError);
            throw new Error("Failed to remove reaction");
        }
        revalidatePath(`/posts/${postSlug}`);
        return { action: "removed" };
    } else {
        // Add reaction
        const { error: insertError } = await supabaseAdmin.from("reactions").insert([
            {
                post_slug: postSlug,
                user_id: finalUserId,
                reaction,
                comment_id: commentId,
            },
        ]);

        if (insertError) {
            console.error("toggleReactionAction: Insert error", insertError);
            throw new Error("Failed to add reaction");
        }
        revalidatePath(`/posts/${postSlug}`);
        return { action: "added" };
    }
}

export async function toggleBookmarkAction({
    postSlug,
}: {
    postSlug: string;
}) {
    const result = bookmarkSchema.safeParse({ postSlug });
    if (!result.success) throw new Error("Invalid Input");
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized: Login required to bookmark");
    }

    console.log("toggleBookmarkAction: Toggling bookmark for", postSlug, "User:", userId);

    // Check if bookmark already exists
    const { data: existing } = await supabaseAdmin
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("post_slug", postSlug)
        .single();

    console.log("toggleBookmarkAction: Existing bookmark?", existing);

    if (existing) {
        // Remove bookmark
        const { error: deleteError } = await supabaseAdmin
            .from("bookmarks")
            .delete()
            .eq("id", existing.id);

        if (deleteError) {
            console.error("toggleBookmarkAction: Delete error", deleteError);
            throw new Error("Failed to remove bookmark");
        }

        revalidatePath(`/posts/${postSlug}`);
        revalidatePath("/bookmarks");
        return { action: "removed" };
    } else {
        // Add bookmark
        const { data, error } = await supabaseAdmin.from("bookmarks").insert([
            {
                user_id: userId,
                post_slug: postSlug,
            },
        ]).select();

        if (error) {
            console.error("toggleBookmarkAction: Insert error", error);
            throw new Error("Failed to save bookmark: " + error.message);
        }

        console.log("toggleBookmarkAction: Insert success", data);

        revalidatePath(`/posts/${postSlug}`);
        revalidatePath("/bookmarks");
        return { action: "added" };
    }
}

export async function checkBookmarkAction(postSlug: string) {
    const { userId } = await auth();
    if (!userId) return false;

    const { data, error } = await supabaseAdmin
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("post_slug", postSlug)
        .single();

    return !!data;
}

export async function toggleFollowAction({
    followingId,
    username, // for revalidation
}: {
    followingId: string;
    username: string;
}) {
    const result = followSchema.safeParse({ followingId });
    if (!result.success) throw new Error("Invalid Input");

    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized: Login required to follow users");
    }

    if (userId === followingId) {
        throw new Error("You cannot follow yourself");
    }

    // Check if following already exists
    const { data: existing } = await supabaseAdmin
        .from("follows")
        .select("id")
        .eq("follower_id", userId)
        .eq("following_id", followingId)
        .single();

    if (existing) {
        // Unfollow
        const { error: deleteError } = await supabaseAdmin
            .from("follows")
            .delete()
            .eq("id", existing.id);

        if (deleteError) {
            console.error("toggleFollowAction: Delete error", deleteError);
            throw new Error(`Failed to unfollow: ${deleteError.message}`);
        }

        revalidatePath(`/${username}`);
        return { action: "unfollowed" };
    } else {
        // Follow
        const { error: insertError } = await supabaseAdmin.from("follows").insert([
            {
                follower_id: userId,
                following_id: followingId,
            },
        ]);

        if (insertError) {
            console.error("toggleFollowAction: Insert error", insertError);
            throw new Error(`Failed to follow: ${insertError.message}`);
        }

        revalidatePath(`/${username}`);
        return { action: "followed" };
    }
}

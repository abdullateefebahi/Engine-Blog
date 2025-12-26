"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

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
    ]);

    if (error) {
        console.error("Error adding reaction:", error);
        return null;
    }

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
        return null; // Don't throw, just return null so UI can handle
    }

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
    const { userId } = await auth();
    const finalUserId = userId || guestId;

    if (!finalUserId) {
        throw new Error("Unauthorized: Login or guest ID required");
    }

    // Check if reaction already exists
    const query = supabaseAdmin
        .from("reactions")
        .select("*")
        .eq("user_id", finalUserId)
        .eq("reaction", reaction);

    if (commentId) {
        query.eq("comment_id", commentId);
    } else {
        query.eq("post_slug", postSlug).is("comment_id", null);
    }

    const { data: existing } = await query;

    if (existing && existing.length > 0) {
        // Remove reaction
        await supabaseAdmin
            .from("reactions")
            .delete()
            .eq("id", existing[0].id);
        return { action: "removed" };
    } else {
        // Add reaction
        await supabaseAdmin.from("reactions").insert([
            {
                post_slug: postSlug,
                user_id: finalUserId,
                reaction,
                comment_id: commentId,
            },
        ]);
        return { action: "added" };
    }
}

import { supabase } from "./supabase";

export type Comment = {
    id: number;
    post_slug: string;
    user_id: string | null;
    user_name: string;
    user_avatar: string | null;
    comment: string;
    created_at: string;
    is_approved: boolean;
};

// Fetch all approved comments for a post, newest last
export async function getComments(postSlug: string): Promise<Comment[]> {
    const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_slug", postSlug)
        .eq("is_approved", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching comments:", error);
        return [];
    }

    return data as Comment[];
}

export async function addComment({
    postSlug,
    userName,
    userId = null,
    userAvatar = null,
    comment,
}: {
    postSlug: string;
    userName: string;
    userId?: string | null;
    userAvatar?: string | null;
    comment: string;
}) {
    const { data, error } = await supabase.from("comments").insert([
        {
            post_slug: postSlug,
            user_name: userName,
            user_id: userId,
            user_avatar: userAvatar,
            comment,
        },
    ]);

    if (error) {
        console.error("Error adding comment:", error);
        return null;
    }

    return data;
}

export async function getCommentCount(postSlug: string): Promise<number> {
    const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_slug", postSlug)
        .eq("is_approved", true);

    if (error) {
        console.error("Error fetching comment count:", error);
        return 0;
    }

    return count || 0;
}

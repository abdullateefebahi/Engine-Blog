import { supabase } from "./supabase";

import { Reaction } from "./reactions";

export type Comment = {
    id: number;
    post_slug: string;
    parent_id: number | null;
    user_id: string | null;
    user_name: string;
    user_avatar: string | null;
    comment: string;
    created_at: string;
    is_approved: boolean;
    reactions?: Reaction[];
    profiles?: { username: string };
};

// Fetch all approved comments for a post, newest last
export async function getComments(postSlug: string): Promise<Comment[]> {
    const { data: comments, error } = await supabase
        .from("comments")
        .select("*, reactions(*)")
        .eq("post_slug", postSlug)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching comments:", error);
        return [];
    }

    if (!comments || comments.length === 0) return [];

    // Fetch profiles separately to avoid join relationship issues if FKs are missing
    const userIds = Array.from(new Set(comments.map(c => c.user_id).filter(id => id && id !== 'guest')));

    if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", userIds);

        if (!profileError && profiles) {
            const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]));
            return comments.map(c => ({
                ...c,
                profiles: c.user_id ? profileMap[c.user_id] : undefined
            })) as Comment[];
        }
    }

    return comments as Comment[];
}

export async function addComment({
    postSlug,
    userName,
    userId = null,
    userAvatar = null,
    comment,
    parentId = null,
}: {
    postSlug: string;
    userName: string;
    userId?: string | null;
    userAvatar?: string | null;
    comment: string;
    parentId?: number | null;
}) {
    const { data, error } = await supabase.from("comments").insert([
        {
            post_slug: postSlug,
            parent_id: parentId,
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
    if (!postSlug) return 0;

    const { count, error } = await supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("post_slug", postSlug)
        .eq("is_approved", true);

    if (error) {
        console.error("Error fetching comment count for", postSlug, ":", error.message, error);
        return 0;
    }

    return count || 0;
}
export async function getCommentCounts(postSlugs: string[]): Promise<Record<string, number>> {
    if (!postSlugs.length) return {};

    const { data, error } = await supabase
        .from("comments")
        .select("post_slug")
        .in("post_slug", postSlugs)
        .eq("is_approved", true);

    if (error) {
        console.error("Error fetching batch comment counts:", error);
        return {};
    }

    const counts: Record<string, number> = {};
    data.forEach(item => {
        counts[item.post_slug] = (counts[item.post_slug] || 0) + 1;
    });

    return counts;
}

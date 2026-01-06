import { supabase } from "./supabase";

export type Reaction = {
    id: number;
    post_slug: string;
    comment_id: number | null;
    user_id: string | null;
    reaction: string;
    created_at: string;
};

// Fetch all reactions for a post
export async function getReactions(postSlug: string): Promise<Reaction[]> {
    const { data, error } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_slug", postSlug);

    if (error) {
        console.error("Error fetching reactions:", error);
        return [];
    }

    return data as Reaction[];
}

// Add a reaction
export async function addReaction({
    postSlug,
    userId = null,
    reaction,
    commentId = null,
}: {
    postSlug: string;
    userId?: string | null;
    reaction: string;
    commentId?: number | null;
}) {
    const { data, error } = await supabase.from("reactions").insert([
        {
            post_slug: postSlug,
            user_id: userId,
            reaction,
            comment_id: commentId,
        },
    ]);

    if (error) {
        console.error("Error adding reaction detailed:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        return null;
    }

    return data;
}

export async function removeReaction({
    postSlug,
    userId,
    reaction,
}: {
    postSlug: string;
    userId: string;
    reaction: string;
}) {
    const { data, error } = await supabase
        .from("reactions")
        .delete()
        .eq("post_slug", postSlug)
        .eq("user_id", userId)
        .eq("reaction", reaction)
        .select();

    if (error) {
        console.error("Supabase error removing reaction detailed:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
    } else {
        //console.log("Reactions removed successfully:", data);
    }

    return { data, error };
}

export async function getReactionCount(postSlug: string): Promise<number> {
    if (!postSlug) return 0;

    const { count, error } = await supabase
        .from("reactions")
        .select("id", { count: "exact", head: true })
        .eq("post_slug", postSlug);

    if (error) {
        console.error("Error fetching reaction count for", postSlug, ":", error.message, error);
        return 0;
    }

    return count || 0;
}
export async function getReactionCounts(postSlugs: string[]): Promise<Record<string, number>> {
    if (!postSlugs.length) return {};

    const { data, error } = await supabase
        .from("reactions")
        .select("post_slug")
        .in("post_slug", postSlugs);

    if (error) {
        console.error("Error fetching batch reaction counts:", error);
        return {};
    }

    const counts: Record<string, number> = {};
    data.forEach(item => {
        counts[item.post_slug] = (counts[item.post_slug] || 0) + 1;
    });

    return counts;
}

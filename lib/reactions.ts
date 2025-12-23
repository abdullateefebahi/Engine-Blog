import { supabase } from "./supabase";

export type Reaction = {
    id: number;
    post_slug: string;
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
}: {
    postSlug: string;
    userId?: string | null;
    reaction: string;
}) {
    const { data, error } = await supabase.from("reactions").insert([
        {
            post_slug: postSlug,
            user_id: userId,
            reaction,
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
    console.log("Attempting to remove reaction:", { postSlug, userId, reaction });
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
        console.log("Reactions removed successfully:", data);
    }

    return { data, error };
}

export async function getReactionCount(postSlug: string): Promise<number> {
    const { count, error } = await supabase
        .from("reactions")
        .select("*", { count: "exact", head: true })
        .eq("post_slug", postSlug);

    if (error) {
        console.error("Error fetching reaction count:", error);
        return 0;
    }

    return count || 0;
}

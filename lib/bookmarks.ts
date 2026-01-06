
import { supabaseAdmin } from "@/lib/supabase-admin";

export interface Bookmark {
    id: string;
    user_id: string;
    post_slug: string;
    created_at: string;
}

export async function getBookmarks(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("bookmarks")
        .select("post_slug")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching bookmarks:", error);
        return [];
    }

    return data.map((b: { post_slug: string }) => b.post_slug);
}

export async function isBookmarked(userId: string, postSlug: string) {
    const { data, error } = await supabaseAdmin
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("post_slug", postSlug)
        .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is "The result contains 0 rows"
        console.error("Error checking bookmark:", error);
    }

    return !!data;
}

import { supabase } from "./supabase";

export async function getFollowersCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("following_id", userId);

    if (error) {
        console.error("Error fetching followers count:", error);
        return 0;
    }

    return count || 0;
}

export async function getFollowingCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", userId);

    if (error) {
        console.error("Error fetching following count:", error);
        return 0;
    }

    return count || 0;
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error checking follow status:", error);
        return false;
    }

    return !!data;
}

export async function getFollowers(userId: string) {
    const { data: follows, error } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("following_id", userId);

    if (error) {
        console.error("Error fetching followers:", error);
        return [];
    }

    const followerIds = follows.map(f => f.follower_id);
    if (followerIds.length === 0) return [];

    // Fetch profiles. Use select(*) or specific fields.
    const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", followerIds);

    if (profileError) {
        console.error("Error fetching follower profiles:", profileError);
        return [];
    }

    return profiles;
}

export async function getFollowing(userId: string) {
    const { data: follows, error } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", userId);

    if (error) {
        console.error("Error fetching following:", error);
        return [];
    }

    const followingIds = follows.map(f => f.following_id);
    if (followingIds.length === 0) return [];

    const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", followingIds);

    if (profileError) {
        console.error("Error fetching following profiles:", profileError);
        return [];
    }

    return profiles;
}

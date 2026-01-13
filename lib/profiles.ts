import { supabase } from "./supabase";

export async function searchProfiles(query: string) {
    if (!query || query.length < 2) return [];

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, department")
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(10);

    if (error) {
        console.error("Error searching profiles:", error);
        return [];
    }

    return data;
}

export async function getProfileById(id: string) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching profile by ID:", error);
        return null;
    }

    return data;
}
export async function getProfiles() {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, department")
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Error fetching profiles:", error);
        return [];
    }

    return data;
}

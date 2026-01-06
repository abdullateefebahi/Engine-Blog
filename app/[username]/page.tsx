import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { clerkClient, auth } from "@clerk/nextjs/server";
import ProfileSocial from "@/components/ProfileSocial";
import { getFollowersCount, getFollowingCount, isFollowing as checkFollowStatus, getFollowers, getFollowing } from "@/lib/follows";

export async function generateMetadata(props: {
    params: Promise<{ username: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const username = params.username.replace("%40", "@");
    const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

    // 1. Try Supabase
    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, username")
        .eq("username", cleanUsername)
        .single();

    if (profile) {
        return {
            title: `${profile.full_name} (@${profile.username}) | Engine Blog`,
            description: `View ${profile.full_name}'s profile on Engine Blog.`,
        };
    }

    // 2. Try Clerk Fallback for Metadata
    try {
        const client = await clerkClient();
        const users = await client.users.getUserList({
            query: cleanUsername,
            limit: 1,
        });

        if (users.data.length > 0) {
            const u = users.data[0];
            const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || cleanUsername;
            return {
                title: `${name} (@${u.username || cleanUsername}) | Engine Blog`,
                description: `View ${name}'s profile on Engine Blog.`,
            };
        }
    } catch (e) {
        console.error("Metadata Clerk fetch error:", e);
    }

    return { title: "User Not Found" };
}

export default async function PublicProfilePage(props: {
    params: Promise<{ username: string }>;
}) {
    const params = await props.params;
    const username = params.username.replace("%40", "@");
    const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

    // 1. Try to fetch from Supabase first
    const { data: supabaseProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", cleanUsername)
        .single();

    let profileData: any = supabaseProfile;

    // 2. If not in Supabase, try to fetch from Clerk
    if (!profileData) {
        try {
            const client = await clerkClient();
            const users = await client.users.getUserList({
                query: cleanUsername,
                limit: 1,
            });

            if (users.data.length > 0) {
                const clerkUser = users.data[0];
                profileData = {
                    id: clerkUser.id,
                    username: clerkUser.username || cleanUsername,
                    full_name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username,
                    avatar_url: clerkUser.imageUrl,
                    department: (clerkUser.publicMetadata?.department as string) || "General",
                    year_of_study: (clerkUser.publicMetadata?.yearOfStudy as string) || "N/A",
                    created_at: new Date(clerkUser.createdAt).toISOString(),
                };
            }
        } catch (clerkError) {
            console.error("Clerk API fetch error in Profile:", clerkError);
        }
    }

    if (!profileData) {
        notFound();
    }

    // Fetch user's recent comments
    const { data: comments } = await supabase
        .from("comments")
        .select("*, reactions(*)")
        .eq("user_id", profileData.id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(10);

    // Social data
    const { userId: currentUserId } = await auth();
    const [followerCount, followingCount, initialIsFollowing, followers, following] = await Promise.all([
        getFollowersCount(profileData.id),
        getFollowingCount(profileData.id),
        currentUserId ? checkFollowStatus(currentUserId, profileData.id) : Promise.resolve(false),
        getFollowers(profileData.id),
        getFollowing(profileData.id)
    ]);

    return (
        <main className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6 group">
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Blog
                </Link>

                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-8 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl flex-shrink-0 bg-blue-600 flex items-center justify-center text-white text-5xl font-bold">
                            {profileData.avatar_url ? (
                                <Image
                                    src={profileData.avatar_url}
                                    alt={profileData.full_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                profileData.full_name.charAt(0).toUpperCase()
                            )}
                        </div>

                        <div className="flex-grow">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                                {profileData.full_name}
                            </h1>
                            <p className="text-xl text-blue-600 dark:text-blue-400 font-bold mb-4">
                                @{profileData.username}
                            </p>

                            <ProfileSocial
                                profileId={profileData.id}
                                username={profileData.username}
                                followerCount={followerCount}
                                followingCount={followingCount}
                                followers={followers}
                                following={following}
                                initialIsFollowing={initialIsFollowing}
                            />

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Department</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{profileData.department || "General"}</span>
                                </div>
                                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Level</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{profileData.year_of_study || "N/A"}</span>
                                </div>
                                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Joined</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{new Date(profileData.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                        <span className="w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                        Recent Comments
                    </h2>

                    {comments && comments.length > 0 ? (
                        <div className="grid gap-4">
                            {comments.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/posts/${c.post_slug}#comments`}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                            In: {c.post_slug.replace(/-/g, ' ')}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-medium">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3 italic">
                                        "{c.comment}"
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <span>View full conversation</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No public comments yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Metadata } from "next";
import ProfileSearchCard from "@/components/ProfileSearchCard";
import { getProfiles } from "@/lib/profiles";

export const revalidate = 0;

export const metadata: Metadata = {
    title: "Discover People | Engine Blog",
    description: "Find and connect with other students and faculty members on Engine Blog.",
};

export default async function DiscoverPage() {
    const profiles = await getProfiles();

    return (
        <main className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6 group">
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Blog
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                        Discover People
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Connect with fellow engineers and stay updated with their latest contributions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profiles && profiles.length > 0 ? (
                        profiles.map((profile: any) => (
                            <ProfileSearchCard key={profile.id} profile={profile} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No profiles found yet. Be the first to join!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

import Link from "next/link";
import Image from "next/image";

interface ProfileSearchCardProps {
    profile: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
        department: string;
    }
}

export default function ProfileSearchCard({ profile }: ProfileSearchCardProps) {
    return (
        <Link
            href={`/${profile.username}`}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
        >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0 bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    profile.full_name.charAt(0).toUpperCase()
                )}
            </div>
            <div className="flex-grow">
                <h4 className="font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {profile.full_name}
                </h4>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">@{profile.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-widest">
                    {profile.department || "General"}
                </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}

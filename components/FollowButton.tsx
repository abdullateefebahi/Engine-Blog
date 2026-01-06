"use client";
import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { toggleFollowAction } from "@/app/actions/social";
import { toast } from "react-hot-toast";

interface FollowButtonProps {
    followingId: string;
    username: string;
    initialIsFollowing: boolean;
}

export default function FollowButton({ followingId, username, initialIsFollowing }: FollowButtonProps) {
    const { user, isLoaded } = useUser();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, startTransition] = useTransition();

    if (!isLoaded || (user && user.id === followingId)) return null;

    const handleFollow = async () => {
        if (!user) {
            toast.error("Please sign in to follow users");
            return;
        }

        startTransition(async () => {
            // Optimistic update
            const newIsFollowing = !isFollowing;
            setIsFollowing(newIsFollowing);

            try {
                const result = await toggleFollowAction({ followingId, username });
                if (result.action === "followed") {
                    toast.success(`Following @${username}`);
                } else {
                    toast.success(`Unfollowed @${username}`);
                }
            } catch (error: any) {
                // Revert on error
                setIsFollowing(!newIsFollowing);
                toast.error(error.message || "Something went wrong");
            }
        });
    };

    return (
        <button
            onClick={handleFollow}
            disabled={isPending}
            className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 transform active:scale-95 ${isFollowing
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isPending ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                </span>
            ) : isFollowing ? (
                "Following"
            ) : (
                "Follow"
            )}
        </button>
    );
}

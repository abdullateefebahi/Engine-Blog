"use client";
import { useState } from "react";
import FollowModal from "./FollowModal";
import FollowButton from "./FollowButton";

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
}

interface ProfileSocialProps {
    profileId: string;
    username: string;
    followerCount: number;
    followingCount: number;
    followers: Profile[];
    following: Profile[];
    initialIsFollowing: boolean;
}

export default function ProfileSocial({
    profileId,
    username,
    followerCount,
    followingCount,
    followers,
    following,
    initialIsFollowing
}: ProfileSocialProps) {
    const [isFollowersOpen, setIsFollowersOpen] = useState(false);
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);

    return (
        <>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-6">
                <button
                    onClick={() => setIsFollowersOpen(true)}
                    className="flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors group"
                >
                    <span className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{followerCount}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider group-hover:text-blue-500 transition-colors">Followers</span>
                </button>
                <button
                    onClick={() => setIsFollowingOpen(true)}
                    className="flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition-colors group"
                >
                    <span className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{followingCount}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider group-hover:text-blue-500 transition-colors">Following</span>
                </button>
                <FollowButton
                    followingId={profileId}
                    username={username}
                    initialIsFollowing={initialIsFollowing}
                />
            </div>

            <FollowModal
                isOpen={isFollowersOpen}
                onClose={() => setIsFollowersOpen(false)}
                title="Followers"
                profiles={followers}
            />
            <FollowModal
                isOpen={isFollowingOpen}
                onClose={() => setIsFollowingOpen(false)}
                title="Following"
                profiles={following}
            />
        </>
    );
}

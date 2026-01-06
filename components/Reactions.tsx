"use client";

import { useEffect, useState } from "react";
import { getReactions, Reaction } from "@/lib/reactions";
import { useUser } from "@clerk/nextjs";
import { addReactionAction, removeReactionAction } from "@/app/actions/social";

const EMOJIS = ["❤️", "😂", "😢", "😠"];

export default function Reactions({ postSlug }: { postSlug: string }) {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [sessionUserId, setSessionUserId] = useState<string>("");
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const setupId = async () => {
            if (user) {
                setSessionUserId(user.id);
            } else {
                // 2. Fallback to anonymous ID
                let gid = localStorage.getItem("guestId");
                if (!gid) {
                    gid = `guest_${Math.random().toString(36).substring(2, 11)}`;
                    localStorage.setItem("guestId", gid);
                }
                setSessionUserId(gid);
            }
            fetchReactions();
        };

        if (isLoaded) {
            setupId();
        }
    }, [isLoaded, user, postSlug]);

    const fetchReactions = async () => {
        const data = await getReactions(postSlug);
        setReactions(data);
    };

    const handleClick = async (emoji: string) => {
        if (!sessionUserId) return;

        // Optimistic update
        const existing = reactions.find(
            (r) => r.user_id === sessionUserId && r.reaction === emoji
        );

        // Update UI immediately
        if (existing) {
            setReactions(prev => prev.filter(r => r.id !== existing.id));
        } else {
            const tempReaction: Reaction = {
                id: Math.random(),
                post_slug: postSlug,
                comment_id: null,
                user_id: sessionUserId,
                reaction: emoji,
                created_at: new Date().toISOString()
            };
            setReactions(prev => [...prev, tempReaction]);
        }

        try {
            if (existing) {
                await removeReactionAction({
                    postSlug,
                    reaction: emoji,
                    guestId: user ? null : sessionUserId
                });
            } else {
                await addReactionAction({
                    postSlug,
                    reaction: emoji,
                    guestId: user ? null : sessionUserId
                });
            }
        } catch (error) {
            console.error("Reaction update failed:", error);
            fetchReactions();
        }
    };

    const countReactions = (emoji: string) =>
        reactions.filter((r) => r.reaction === emoji).length;

    const userHasReacted = (emoji: string) =>
        reactions.some((r) => r.user_id === sessionUserId && r.reaction === emoji);

    if (!isLoaded) return null;

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {EMOJIS.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => handleClick(emoji)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${userHasReacted(emoji)
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105"
                        }`}
                >
                    <span className="text-lg leading-none">{emoji}</span>
                    <span>{countReactions(emoji)}</span>
                </button>
            ))}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { getReactions, addReaction, removeReaction, Reaction } from "@/lib/reactions";
import { supabase } from "@/lib/supabase";

const EMOJIS = ["❤️", "😂", "😢", "👎"];

export default function Reactions({ postSlug }: { postSlug: string }) {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [sessionUserId, setSessionUserId] = useState<string>("");

    useEffect(() => {
        const setupId = async () => {
            // 1. Try to get authenticated user
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setSessionUserId(user.id);
            } else {
                // 2. Fallback to anonymous ID
                let anonId = sessionStorage.getItem("anonUserId");
                if (!anonId) {
                    anonId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
                    sessionStorage.setItem("anonUserId", anonId);
                }
                setSessionUserId(anonId);
            }
            fetchReactions();
        };

        setupId();

        // Listen for auth changes to switch IDs (e.g. if user logs in)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setSessionUserId(session.user.id);
            } else {
                let anonId = sessionStorage.getItem("anonUserId");
                if (!anonId) {
                    anonId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
                    sessionStorage.setItem("anonUserId", anonId);
                }
                setSessionUserId(anonId);
            }
        });

        return () => subscription.unsubscribe();
    }, [postSlug]);

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
                user_id: sessionUserId,
                reaction: emoji,
                created_at: new Date().toISOString()
            };
            setReactions(prev => [...prev, tempReaction]);
        }

        try {
            if (existing) {
                const { data, error } = await removeReaction({
                    postSlug,
                    userId: sessionUserId,
                    reaction: emoji
                });

                if (error || (data && data.length === 0)) {
                    console.error("Failed to remove reaction:", error || "No rows deleted");
                    fetchReactions(); // Revert on failure or no-op
                }
            } else {
                const data = await addReaction({
                    postSlug,
                    userId: sessionUserId,
                    reaction: emoji
                });
                if (!data) fetchReactions(); // Revert on failure
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

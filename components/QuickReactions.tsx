"use client";

import { useState, useEffect, useRef } from "react";
import { addReaction, removeReaction, getReactions, Reaction } from "@/lib/reactions";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const EMOJIS = [
    { emoji: "👍", label: "Like" },
    { emoji: "❤️", label: "Love" },
    { emoji: "😂", label: "Funny" },
    { emoji: "😢", label: "Sad" },
];

export default function QuickReactions({ postSlug }: { postSlug: string }) {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [sessionUserId, setSessionUserId] = useState<string>("");
    const [showPicker, setShowPicker] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const pickerTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initial user setup
        const setupUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setSessionUserId(user.id);
            } else {
                let anonId = sessionStorage.getItem("anonUserId");
                if (!anonId) {
                    // Create a valid-ish UUID v4 for anonymous users if crypto is available, 
                    // otherwise fall back to a simple random string (which might fail if DB expects UUID)
                    anonId = typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : 'anon-' + Math.random().toString(36).substring(2, 11);
                    sessionStorage.setItem("anonUserId", anonId);
                }
                setSessionUserId(anonId);
            }
            await fetchReactions();
        };

        setupUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setSessionUserId(session.user.id);
            } else {
                const anonId = sessionStorage.getItem("anonUserId");
                if (anonId) setSessionUserId(anonId);
            }
        });

        return () => subscription.unsubscribe();
    }, [postSlug]);

    const fetchReactions = async () => {
        const data = await getReactions(postSlug);
        setReactions(data);
    };

    const userReaction = reactions.find(r => r.user_id === sessionUserId);

    const handleReaction = async (emoji: string) => {
        if (!sessionUserId) return;

        // Optimistic update
        const existing = reactions.find(
            (r) => r.user_id === sessionUserId && r.reaction === emoji
        );

        let newReactions = [...reactions];
        if (existing) {
            newReactions = newReactions.filter((r) => r !== existing);
        } else {
            // Remove other reactions by same user for "exclusive" feel like FB
            newReactions = newReactions.filter(r => r.user_id !== sessionUserId);
            newReactions.push({
                id: Math.random(),
                post_slug: postSlug,
                user_id: sessionUserId,
                reaction: emoji,
                created_at: new Date().toISOString()
            });
        }
        setReactions(newReactions);
        setShowPicker(false);

        try {
            if (existing) {
                await removeReaction({ postSlug, userId: sessionUserId, reaction: emoji });
            } else {
                // If user had a different reaction, remove it first (implicit in FB style)
                const otherReaction = reactions.find(r => r.user_id === sessionUserId && r.reaction !== emoji);
                if (otherReaction) {
                    await removeReaction({ postSlug, userId: sessionUserId, reaction: otherReaction.reaction });
                }
                await addReaction({ postSlug, userId: sessionUserId, reaction: emoji });
            }
        } catch (error) {
            console.error("Failed to update reaction:", error);
            fetchReactions();
        }
    };

    const handleMouseEnter = () => {
        if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
        setIsHovered(true);
        // Delay showing picker slightly for better UX
        pickerTimeout.current = setTimeout(() => {
            setShowPicker(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
        setIsHovered(false);
        // Delay hiding picker
        pickerTimeout.current = setTimeout(() => {
            setShowPicker(false);
        }, 500);
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Main Button */}
            <button
                onClick={() => handleReaction(userReaction ? userReaction.reaction : "👍")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${userReaction
                    ? "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    : "text-gray-500 hover:text-gray-700 bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300"
                    }`}
            >
                {userReaction ? (
                    <span className="text-base">{userReaction.reaction}</span>
                ) : (
                    <FontAwesomeIcon icon={faThumbsUp} className="w-4 h-4" />
                )}
                <span>{userReaction ? "Reacted" : "React"}</span>
            </button>

            {/* Floating Picker */}
            {showPicker && (
                <div className="absolute bottom-full left-0 mb-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                    {EMOJIS.map((e) => (
                        <button
                            key={e.emoji}
                            onClick={() => handleReaction(e.emoji)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-125 hover:-translate-y-1 active:scale-95 group relative"
                            title={e.label}
                        >
                            <span className="text-2xl">{e.emoji}</span>
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {e.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

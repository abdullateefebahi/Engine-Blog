"use client";

import { useState, useEffect, useRef } from "react";
import { getReactions, Reaction } from "@/lib/reactions";
import { addReactionAction, removeReactionAction } from "@/app/actions/social";
import { useUser } from "@clerk/nextjs";
import { logAnalyticsEvent } from "@/lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const EMOJIS = [
    { emoji: "❤️", label: "love" },
    { emoji: "😂", label: "Funny" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😠", label: "angry" },
];

export default function QuickReactions({ postSlug }: { postSlug: string }) {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [sessionUserId, setSessionUserId] = useState<string>("");
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const pickerTimeout = useRef<NodeJS.Timeout | null>(null);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        // Initial user setup
        const setupUser = async () => {
            if (user) {
                setSessionUserId(user.id);
            } else {
                let anonId = localStorage.getItem("guestId");
                if (!anonId) {
                    anonId = `guest_${Math.random().toString(36).substring(2, 11)}`;
                    localStorage.setItem("guestId", anonId);
                }
                setSessionUserId(anonId);
            }
            await fetchReactions();
        };

        if (isLoaded) {
            setupUser();
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLoaded, user, postSlug, showPicker]);

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
                comment_id: null,
                created_at: new Date().toISOString()
            });
        }
        setReactions(newReactions);
        setShowPicker(false);

        try {
            if (existing) {
                await removeReactionAction({
                    postSlug,
                    reaction: emoji,
                    guestId: user ? null : sessionUserId
                });
                logAnalyticsEvent('reaction_removed', { post_slug: postSlug, reaction: emoji });
            } else {
                // If user had a different reaction, remove it first (implicit in FB style)
                const otherReaction = reactions.find(r => r.user_id === sessionUserId && r.reaction !== emoji);
                if (otherReaction) {
                    await removeReactionAction({
                        postSlug,
                        reaction: otherReaction.reaction,
                        guestId: user ? null : sessionUserId
                    });
                    logAnalyticsEvent('reaction_changed', { post_slug: postSlug, old_reaction: otherReaction.reaction, new_reaction: emoji });
                }
                await addReactionAction({
                    postSlug,
                    reaction: emoji,
                    guestId: user ? null : sessionUserId
                });
                logAnalyticsEvent('reaction_added', { post_slug: postSlug, reaction: emoji });
            }
        } catch (error) {
            console.error("Failed to update reaction:", error);
            fetchReactions();
        }
    };

    const handleMouseEnter = () => {
        if (window.innerWidth < 1024) return; // Ignore hover on mobile/small screens
        if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
        // Delay showing picker slightly for better UX
        pickerTimeout.current = setTimeout(() => {
            setShowPicker(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (window.innerWidth < 1024) return; // Ignore hover on mobile/small screens
        if (pickerTimeout.current) clearTimeout(pickerTimeout.current);
        // Delay hiding picker
        pickerTimeout.current = setTimeout(() => {
            setShowPicker(false);
        }, 500);
    };

    if (!isLoaded) return null;

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
                e.stopPropagation();
                // Toggle picker on click for mobile, but only if we're not hovering (desktop)
                // Actually, on mobile, click is the primary interaction.
                setShowPicker(!showPicker);
            }}
        >
            {/* Main Button */}
            <button
                onClick={(e) => {
                    if (window.innerWidth < 1024) { // Mobile behavior: toggle picker first
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPicker(!showPicker);
                    } else {
                        handleReaction(userReaction ? userReaction.reaction : "❤️");
                    }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${userReaction
                    ? "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    : "text-gray-500 hover:text-gray-700 bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300"
                    }`}
            >
                {userReaction ? (
                    <span className="text-base">{userReaction.reaction}</span>
                ) : (
                    <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                )}
                <span>{reactions.length > 0 ? reactions.length : 0}</span>
            </button>

            {/* Floating Picker */}
            {showPicker && (
                <div
                    ref={pickerRef}
                    className="absolute bottom-full left-0 mb-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
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

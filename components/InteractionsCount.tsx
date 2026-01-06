"use client";

import { useEffect, useState } from "react";
import { getCommentCount } from "@/lib/comments";
import { getReactionCount } from "@/lib/reactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function InteractionsCount({ postSlug }: { postSlug: string }) {
    const [commentCount, setCommentCount] = useState<number | null>(null);
    const [reactionCount, setReactionCount] = useState<number | null>(null);

    useEffect(() => {
        async function fetchCounts() {
            try {
                const [comments, reactions] = await Promise.all([
                    getCommentCount(postSlug),
                    getReactionCount(postSlug)
                ]);
                setCommentCount(comments);
                setReactionCount(reactions);
            } catch (error) {
                console.error("Error fetching interaction counts:", error);
            }
        }
        fetchCounts();
    }, [postSlug]);

    if (commentCount === null && reactionCount === null) return null;

    return (
        <>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faCommentAlt} size="lg" />
                <span className="text-sm">{commentCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faHeart} size="lg" />
                <span className="text-sm">{reactionCount || 0}</span>
            </div>
            </div>
        </>
    );
}

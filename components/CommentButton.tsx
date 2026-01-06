"use client";

import { useEffect, useState } from "react";
import { getCommentCount } from "@/lib/comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll just use template literals

export default function CommentButton({ postSlug, className }: { postSlug: string, className?: string }) {
    const [commentCount, setCommentCount] = useState<number>(0);

    useEffect(() => {
        async function fetchCount() {
            try {
                const count = await getCommentCount(postSlug);
                setCommentCount(count || 0);
            } catch (error) {
                console.error("Error fetching comment count:", error);
            }
        }
        fetchCount();
    }, [postSlug]);

    return (
        <Link
            href={`/posts/${postSlug}#comments`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/20 border border-gray-100 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-800 transition-all duration-300 ${className || ""}`}
            onClick={(e) => e.stopPropagation()}
        >
            <FontAwesomeIcon icon={faCommentAlt} className="w-4 h-4" />
            <span>{commentCount}</span>
        </Link>
    );
}

"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { toggleBookmarkAction, checkBookmarkAction } from "@/app/actions/social";
import { logAnalyticsEvent } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

interface BookmarkButtonProps {
    postSlug: string;
}

export default function BookmarkButton({ postSlug }: BookmarkButtonProps) {
    const { isSignedIn } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            checkBookmarkAction(postSlug).then((status) => {
                setIsBookmarked(status);
            });
        }
    }, [postSlug, isSignedIn]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a link
        e.stopPropagation();

        if (!isSignedIn) {
            toast.error("Please sign in to bookmark posts");
            return;
        }

        // Optimistic update
        const previousState = isBookmarked;
        setIsBookmarked(!previousState);
        setIsLoading(true);

        try {
            const result = await toggleBookmarkAction({ postSlug });
            if (result.action === "added") {
                toast.success("Post saved to bookmarks");
                logAnalyticsEvent("bookmark_add", { post_slug: postSlug });
            } else {
                toast("Post removed from bookmarks", { icon: "🗑️" });
                logAnalyticsEvent("bookmark_remove", { post_slug: postSlug });
            }
        } catch (error: any) {
            // Revert on error
            setIsBookmarked(previousState);
            const message = error?.message || "Failed to update bookmark";
            toast.error(message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${isBookmarked
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
            disabled={isLoading}
        >
            <FontAwesomeIcon
                icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular}
                className={`w-4 h-4 transition-transform duration-200 ${isBookmarked ? "scale-110" : "group-hover:scale-110"}`}
            />
        </button>
    );
}

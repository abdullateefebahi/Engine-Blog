"use client";

import React, { useState, useRef, useCallback } from "react";
import PostCard from "@/components/PostCard";
import { fetchMorePosts } from "@/app/actions/posts";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/TranslationContext";

interface AuthorPostsClientProps {
    initialPosts: any[];
    authorSlug: string;
}

const POSTS_PER_PAGE = 6;

export default function AuthorPostsClient({
    initialPosts,
    authorSlug,
}: AuthorPostsClientProps) {
    const { t } = useTranslation();
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialPosts.length >= POSTS_PER_PAGE);
    const [offset, setOffset] = useState(initialPosts.length);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const newPosts = await fetchMorePosts({
                start: offset,
                limit: POSTS_PER_PAGE,
                authorSlug: authorSlug
            });

            if (newPosts.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
                setOffset(prevOffset => prevOffset + POSTS_PER_PAGE);
                if (newPosts.length < POSTS_PER_PAGE) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching more author posts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <AnimatePresence mode="popLayout">
                {posts.map((post: any, index: number) => (
                    <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index % POSTS_PER_PAGE * 0.05 }}
                    >
                        <PostCard post={post} />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Sensor for infinite scrolling */}
            <div ref={lastPostElementRef} className="h-10" />

            {loading && (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 font-medium">
                    ✨ {t("Home.allCaughtUp") || "You've seen all articles by this author!"}
                </div>
            )}
        </div>
    );
}

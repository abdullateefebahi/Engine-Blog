"use client";

import React from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import ProfileSearchCard from "@/components/ProfileSearchCard";
import { useTranslation } from "@/contexts/TranslationContext";

interface HomeClientProps {
    categories: any[];
    posts: any[];
    latestPosts: any[];
    notices: any[];
    trendingPosts: any[];
    events: any[];
    profiles: any[];
    activeCategory?: string;
    searchQuery?: string;
}

export default function HomeClient({
    categories,
    posts,
    latestPosts,
    notices,
    trendingPosts,
    events,
    profiles,
    activeCategory,
    searchQuery,
}: HomeClientProps) {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16 pb-12 border-b-2 border-blue-600 dark:border-blue-500">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                            {t("Home.title")}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                            {t("Home.subtitle")}
                        </p>
                    </div>
                </div>

                {/* Categories pills */}
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    <Link
                        href="/"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                            }`}
                    >
                        {t("Home.all")}
                    </Link>

                    {categories.map((cat: any) => (
                        <Link
                            key={cat._id}
                            href={`/?category=${encodeURIComponent(cat.title)}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.title
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                                }`}
                        >
                            {cat.title}
                        </Link>
                    ))}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Posts */}
                    <div className="order-1 lg:col-span-2">
                        {searchQuery && profiles.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-blue-600 rounded-full" />
                                    {t("Home.users")}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profiles.map((profile: any) => (
                                        <ProfileSearchCard key={profile.id} profile={profile} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {posts.length > 0 ? (
                            <div className="flex flex-col gap-8 justify-center max-w-7xl mx-auto">
                                {searchQuery && (
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                                        <span className="w-8 h-1 bg-blue-600 rounded-full" />
                                        {t("Home.articles")}
                                    </h3>
                                )}
                                {posts.map((post: any) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                    {profiles.length > 0 ? t("Home.noArticles") : t("Home.noResults")}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {t("Home.tryAdjusting")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="order-2">
                        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
                            <Sidebar
                                categories={categories}
                                latestPosts={latestPosts}
                                notices={notices}
                                events={events}
                                trendingPosts={trendingPosts}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

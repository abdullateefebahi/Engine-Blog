"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import LightboxImage from "@/components/LightboxImage";
import BookmarkButton from "@/components/BookmarkButton";
import AITools from "@/components/AITools";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import ShareButtons from "@/components/ShareButtons";
import Reactions from "@/components/Reactions";
import CommentsSection from "@/components/Comments";
import RelatedPosts from "@/components/RelatedPosts";
import { portableTextToPlainText } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";

interface PostClientProps {
    post: any;
    relatedPosts: any[];
}

export default function PostClient({ post, relatedPosts }: PostClientProps) {
    const { t, locale } = useTranslation();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900 shadow-sm border-x border-gray-100 dark:border-gray-800/50">
                {post.coverImage && (
                    <LightboxImage
                        src={post.coverImage}
                        alt={post.title}
                        className="mb-10 w-full h-[450px] rounded-[2rem] bg-transparent border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl"
                        showBlurBackground={true}
                    />
                )}

                <div className="flex items-start justify-between gap-4 mb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
                        {post.title}
                    </h1>
                    <div className="shrink-0 pt-2">
                        <BookmarkButton postSlug={post.slug} />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        {post.authorSlug ? (
                            <Link href={`/authors/${post.authorSlug}`} className="flex items-center gap-3 group/author transition-all">
                                {post.authorImage && (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm transition-transform group-hover/author:scale-110 group-hover/author:shadow-md">
                                        <Image
                                            src={post.authorImage}
                                            alt={post.author}
                                            width={40}
                                            height={40}
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    {post.author && (
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-fit group-hover/author:bg-blue-50 dark:group-hover/author:bg-blue-900/30 group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors">
                                            {post.author}
                                        </span>
                                    )}
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                                        {new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                {post.authorImage && (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                                        <Image
                                            src={post.authorImage}
                                            alt={post.author}
                                            width={40}
                                            height={40}
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    {post.author && (
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-fit">
                                            {post.author}
                                        </span>
                                    )}
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                                        {new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {post.categories?.map((cat: string) => (
                            <Link
                                key={cat}
                                href={`/?category=${encodeURIComponent(cat)}`}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full uppercase tracking-wider hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                <AITools
                    content={portableTextToPlainText(post.body)}
                    showBanner={true}
                    publishDate={post.publishedAt}
                    authorName={post.author}
                />

                <div className="prose-container">
                    <PortableTextRenderer value={post.body} />
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">
                        {t("Article.share")}
                    </h3>
                    <ShareButtons url={`/posts/${post.slug}`} title={post.title} />
                </div>

                <div className="mt-12">
                    <Reactions postSlug={post.slug} />
                </div>

                <CommentsSection postSlug={post.slug} />

                <RelatedPosts posts={relatedPosts} />
            </article>
        </main>
    );
}

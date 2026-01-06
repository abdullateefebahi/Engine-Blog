"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

interface RelatedPostsProps {
    posts: any[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="mt-16 pt-16 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Related Articles</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hand-picked posts you might enjoy</p>
                </div>
                <div className="hidden sm:block h-px flex-grow mx-8 bg-gradient-to-r from-gray-100 to-transparent dark:from-gray-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <div
                        key={post.slug}
                        className="group relative flex flex-col bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/20 transition-all duration-500"
                    >
                        {post.coverImage && (
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="relative z-10 flex flex-wrap gap-2 mb-3">
                                {post.categories?.slice(0, 1).map((cat: string) => (
                                    <Link
                                        key={cat}
                                        href={`/?category=${encodeURIComponent(cat)}`}
                                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                <Link href={`/posts/${post.slug}`}>
                                    <span className="absolute inset-0" />
                                    {post.title}
                                </Link>
                            </h3>
                            <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium font-mono uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faCalendar} className="text-blue-500/50" />
                                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Read →</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

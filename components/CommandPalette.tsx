"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileAlt, faTimes, faArrowRight, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { searchPosts } from "@/lib/posts";
import { searchProfiles } from "@/lib/profiles";
import Image from "next/image";

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ posts: any[], profiles: any[] }>({ posts: [], profiles: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Toggle palette on Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Reset search when palette opens
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setResults({ posts: [], profiles: [] });
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Perform search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length < 2) {
                setResults({ posts: [], profiles: [] });
                return;
            }

            setIsLoading(true);
            try {
                const [posts, profiles] = await Promise.all([
                    searchPosts(query),
                    searchProfiles(query)
                ]);
                setResults({
                    posts: posts.slice(0, 5),
                    profiles: profiles.slice(0, 5)
                });
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = useCallback((item: any, type: 'post' | 'profile') => {
        setIsOpen(false);
        if (type === 'post') {
            router.push(`/posts/${item.slug}`);
        } else {
            router.push(`/${item.username}`);
        }
    }, [router]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const totalResults = results.posts.length + results.profiles.length;
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev + 1) % (totalResults || 1));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev - 1 + (totalResults || 1)) % (totalResults || 1));
        } else if (e.key === "Enter") {
            if (selectedIndex < results.profiles.length) {
                handleSelect(results.profiles[selectedIndex], 'profile');
            } else {
                handleSelect(results.posts[selectedIndex - results.profiles.length], 'post');
            }
        }
    };

    return (
        <>
            {/* Search Trigger Button (Desktop Navbar Style) */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center gap-2 xl:gap-3 px-2 xl:px-4 py-2 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 transition-all group max-w-[120px] xl:max-w-[280px]"
            >
                <FontAwesomeIcon icon={faSearch} className="text-sm group-hover:text-blue-500 shrink-0" />
                <span className="text-sm font-medium truncate hidden xl:inline">Search articles and people...</span>
                <div className="hidden lg:flex items-center gap-1 ml-auto py-0.5 px-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-[10px] font-bold shrink-0">
                    <span className="text-[12px]">⌘</span>K
                </div>
            </button>

            {/* Mobile Search Icon */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex md:hidden items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-all active:scale-90"
            >
                <FontAwesomeIcon icon={faSearch} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-gray-950/40 backdrop-blur-md"
                        />

                        {/* Palette Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                            onKeyDown={handleKeyDown}
                        >
                            {/* Search Header */}
                            <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FontAwesomeIcon icon={faSearch} className="text-xl text-gray-400" />
                                )}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search people, articles, or updates..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-grow bg-transparent border-none outline-none text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto p-3 no-scrollbar">
                                {(results.posts.length > 0 || results.profiles.length > 0) ? (
                                    <div className="space-y-4">
                                        {/* Users Section */}
                                        {results.profiles.length > 0 && (
                                            <div className="space-y-1">
                                                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                                    People
                                                </p>
                                                {results.profiles.map((profile, index) => (
                                                    <div
                                                        key={profile.id}
                                                        onClick={() => handleSelect(profile, 'profile')}
                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                        className={`group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${selectedIndex === index
                                                            ? "bg-blue-50 dark:bg-blue-900/20 translate-x-1"
                                                            : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                                            }`}
                                                    >
                                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                            {profile.avatar_url ? (
                                                                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                                            ) : profile.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <h4 className={`text-sm font-bold truncate ${selectedIndex === index ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                                                                {profile.full_name}
                                                            </h4>
                                                            <p className="text-[10px] text-gray-500 font-medium">@{profile.username}</p>
                                                        </div>
                                                        <FontAwesomeIcon icon={faArrowRight} className={`text-xs transition-all duration-300 ${selectedIndex === index ? "text-blue-500 opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Articles Section */}
                                        {results.posts.length > 0 && (
                                            <div className="space-y-1">
                                                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                                    Articles
                                                </p>
                                                {results.posts.map((post, index) => {
                                                    const actualIndex = index + results.profiles.length;
                                                    return (
                                                        <div
                                                            key={post._id}
                                                            onClick={() => handleSelect(post, 'post')}
                                                            onMouseEnter={() => setSelectedIndex(actualIndex)}
                                                            className={`group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${selectedIndex === actualIndex
                                                                ? "bg-blue-50 dark:bg-blue-900/20 translate-x-1"
                                                                : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                                                }`}
                                                        >
                                                            {post.coverImage ? (
                                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                                                                    <Image
                                                                        src={post.coverImage}
                                                                        alt=""
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                                                    <FontAwesomeIcon icon={faFileAlt} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="flex-grow min-w-0">
                                                                <h4 className={`text-sm font-bold truncate ${selectedIndex === actualIndex ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                                                                    {post.title}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {post.categories?.slice(0, 1).map((cat: string) => (
                                                                        <span key={cat} className="text-[10px] text-blue-500 font-bold opacity-70 italic">#{cat.replace(/\s+/g, '')}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <FontAwesomeIcon icon={faArrowRight} className={`text-xs transition-all duration-300 ${selectedIndex === actualIndex ? "text-blue-500 opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : query.length >= 2 && !isLoading ? (
                                    <div className="py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FontAwesomeIcon icon={faSearch} className="text-2xl text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium font-sans">No results found for "{query}"</p>
                                    </div>
                                ) : !query && (
                                    <div className="p-4 space-y-6">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Quick Actions</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <button onClick={() => { router.push('/profile'); setIsOpen(false) }} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                        <FontAwesomeIcon icon={faKeyboard} className="text-sm" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">View Profile</span>
                                                </button>
                                                <button onClick={() => { router.push('/bookmarks'); setIsOpen(false) }} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group">
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                        <FontAwesomeIcon icon={faFileAlt} className="text-sm" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Bookmarked Posts</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-6 py-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500">↑↓</span>
                                                Navigate
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500 flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faSearch} className="text-[8px]" />
                                                    ENTER
                                                </span>
                                                Select
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500">ESC</span>
                                                Close
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

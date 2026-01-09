"use client";

import Link from "next/link";
import SearchInput from "./SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faLayerGroup, faNewspaper, faLink, faCalendarDays, faFire, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { SignedIn } from "@clerk/nextjs";
import { useTranslation } from "@/contexts/TranslationContext";

export default function Sidebar({
    categories,
    latestPosts,
    trendingPosts = [],
    notices = [],
    events = [],
}: {
    categories: any[];
    latestPosts: any[];
    trendingPosts?: any[];
    notices?: any[];
    events?: any[];
}) {
    const { t } = useTranslation();

    return (
        <aside className="space-y-8">
            {/* Saved Posts - Quick Access */}
            <SignedIn>
                <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-blue-500/20 text-white group overflow-hidden relative">
                    {/* Decorative Background Icon */}
                    <FontAwesomeIcon
                        icon={faBookmark}
                        className="absolute -right-4 -bottom-4 text-white/10 text-8xl transform -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-500"
                    />

                    <h3 className="text-lg font-bold mb-2 flex items-center gap-3 relative z-10">
                        <FontAwesomeIcon icon={faBookmark} className="text-white/90" />
                        <span>{t("Sidebar.myCollection")}</span>
                    </h3>
                    <p className="text-xs text-white/70 mb-4 relative z-10 leading-relaxed">
                        {t("Sidebar.collectionDesc")}
                    </p>
                    <Link
                        href="/bookmarks"
                        className="inline-flex items-center justify-center w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 relative z-10 border border-white/10"
                    >
                        {t("Sidebar.viewSaved")}
                    </Link>
                </section>
            </SignedIn>

            {/* Search */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700 font-sans">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                    <FontAwesomeIcon icon={faSearch} className="text-blue-600 w-5" fixedWidth />
                    <span>{t("Sidebar.search")}</span>
                </h3>
                <SearchInput />
            </section>

            {/* Notices */}
            {notices && notices.length > 0 && (
                <section className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-red-500">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
                        <FontAwesomeIcon icon={faBell} className="text-red-500 w-5" fixedWidth />
                        <span>{t("Sidebar.latestNotices")}</span>
                    </h3>
                    <ul className="space-y-3">
                        {notices.map((notice) => (
                            <li key={notice._id}>
                                <Link
                                    href={`/posts/${notice.slug}`}
                                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 line-clamp-2 font-medium"
                                >
                                    {notice.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Link
                            href="/notices"
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            {t("Sidebar.seeAllNotices")}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </section>
            )}

            {/* Upcoming Events */}
            {events && events.length > 0 && (
                <section className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600 w-5" fixedWidth />
                        <span>{t("Sidebar.upcomingEvents")}</span>
                    </h3>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <Link
                                key={event._id}
                                href={`/posts/${event.slug}`}
                                className="group flex items-start gap-3"
                            >
                                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0">
                                    <span className="text-xs font-black leading-none">
                                        {new Date(event.eventDate).getDate()}
                                    </span>
                                    <span className="text-[8px] font-bold uppercase">
                                        {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {event.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                        {event.location || "Faculty Hall"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Link
                            href="/events"
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            {t("Sidebar.viewCalendar")}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </section>
            )}

            {/* Trending Now */}
            {trendingPosts && trendingPosts.length > 0 && (
                <section className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                        <FontAwesomeIcon icon={faFire} className="text-orange-500 w-5" fixedWidth />
                        <span>{t("Sidebar.trendingNow")}</span>
                    </h3>
                    <div className="space-y-4">
                        {trendingPosts.map((post, index) => (
                            <Link
                                key={post.slug}
                                href={`/posts/${post.slug}`}
                                className="group flex items-start gap-3"
                            >
                                <span className="text-2xl font-black text-gray-100 dark:text-gray-700 group-hover:text-blue-100 transition-colors leading-none">
                                    0{index + 1}
                                </span>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            👍 {post.reactions}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            💬 {post.comments}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Categories */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 w-5" fixedWidth />
                    <span>{t("Sidebar.categories")}</span>
                </h3>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
                        >
                            {t("Home.all")}
                        </Link>
                    </li>

                    {categories.map((cat) => (
                        <li key={cat._id}>
                            <Link
                                href={`/?category=${encodeURIComponent(cat.title)}`}
                                className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
                            >
                                {cat.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Latest posts */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
                    <FontAwesomeIcon icon={faNewspaper} className="text-blue-600 w-5" fixedWidth />
                    <span>{t("Sidebar.latestPosts")}</span>
                </h3>
                <ul className="space-y-3">
                    {latestPosts.slice(0, 5).map((post) => (
                        <li key={post.slug}>
                            <Link
                                href={`/posts/${post.slug}`}
                                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium"
                            >
                                {post.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Quick Links */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                    <FontAwesomeIcon icon={faLink} className="text-blue-600 w-5" fixedWidth />
                    <span>{t("Sidebar.quickLinks")}</span>
                </h3>
                <ul className="space-y-3">
                    <li>
                        <a
                            href="https://www.uniben.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 group"
                        >
                            <span>{t("Sidebar.unibenWebsite")}</span>
                            <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://unibenportal.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 group"
                        >
                            <span>{t("Sidebar.unibenPortal")}</span>
                            <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://jhl.uniben.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 group"
                        >
                            <span>{t("Sidebar.johnHarrisLibrary")}</span>
                            <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </section>
        </aside>
    );
}


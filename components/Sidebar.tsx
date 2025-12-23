import Link from "next/link";
import SearchInput from "./SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faLayerGroup, faNewspaper, faLink, faCalendarDays, faFire } from "@fortawesome/free-solid-svg-icons";

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
    return (
        <aside className="space-y-8">
            {/* Search */}
            <section className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700 font-sans">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-3">
                    <FontAwesomeIcon icon={faSearch} className="text-blue-600 w-5" fixedWidth />
                    <span>Search</span>
                </h3>
                <SearchInput />
            </section>

            {/* Notices */}
            {notices && notices.length > 0 && (
                <section className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-red-500">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
                        <FontAwesomeIcon icon={faBell} className="text-red-500 w-5" fixedWidth />
                        <span>Latest Notices</span>
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
                            See all notices
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
                        <span>Upcoming Events</span>
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
                            View event calendar
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
                        <span>Trending Now</span>
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
                    <span>Categories</span>
                </h3>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
                        >
                            All
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
                    <span>Latest Posts</span>
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
                    <span>Quick Links</span>
                </h3>
                <ul className="space-y-3">
                    <li>
                        <a
                            href="https://www.uniben.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 group"
                        >
                            <span>UNIBEN Website</span>
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
                            <span>Uniben Student Portal</span>
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
                            <span>John Harris Library</span>
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

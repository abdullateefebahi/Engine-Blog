import { Metadata } from "next";
import Link from "next/link";
import { getAllNotices } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Official Notices",
    description: "Stay informed with the latest official announcements and academic updates from the Faculty of Engineering, UNIBEN.",
    openGraph: {
        title: "Official Notices | Engine Blog",
        description: "Stay informed with the latest official announcements and academic updates from the Faculty of Engineering, UNIBEN.",
    }
};

export default async function NoticesPage() {
    const notices = await getAllNotices();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Official Notices</span>
                </nav>

                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                        Notice Board
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                        Latest official announcements and academic updates from the faculty.
                    </p>
                </div>

                {notices.length > 0 ? (
                    <div className="space-y-6">
                        {notices.map((notice: any) => (
                            <Link
                                key={notice._id}
                                href={`/posts/${notice.slug}`}
                                className="group block bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 dark:border-red-800">
                                                Important
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                                {formatDate(notice.publishedAt, {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4 line-clamp-2 leading-tight">
                                            {notice.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                            {notice.excerpt || "Click to read the full details of this announcement."}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
                                        <span className="text-sm">View Details</span>
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-20 rounded-[3rem] text-center border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">📭</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active notices</h3>
                        <p className="text-gray-500 dark:text-gray-400">Check back later for official announcements.</p>
                    </div>
                )}
            </div>
        </main>
    );
}

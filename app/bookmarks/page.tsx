import { auth } from "@clerk/nextjs/server";
import { getBookmarks } from "@/lib/bookmarks";
import { getPostsBySlugs } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: "Saved Posts",
    description: "View your saved posts",
};

export default async function BookmarksPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const bookmarkedSlugs = await getBookmarks(userId);
    const posts = await getPostsBySlugs(bookmarkedSlugs);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
                        Saved Posts
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Your personal collection of bookmarked articles.
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <div key={post._id} className="h-full">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No saved posts yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            When you find an interesting article, tap the bookmark icon to save it here for later reading.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            Explore Articles
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

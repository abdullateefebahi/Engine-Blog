import { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import {
  getAllPosts,
  getAllCategories,
  getPostsByCategory,
  searchPosts,
} from "@/lib/posts";
import { getTrendingPosts, getNotices, getEvents } from "@/lib/api";

export const metadata: Metadata = {
  title: "Home",
  description: "Stay updated with the latest news, academic notices, and student life from the Faculty of Engineering, University of Benin.",
  openGraph: {
    title: "Engine Blog",
    description: "Stay updated with the latest news, academic notices, and student life from the Faculty of Engineering, University of Benin.",
    type: "website",
    siteName: "Engine Blog",
  }
};

export default async function Home(props: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;

  const activeCategory = searchParams.category;
  const searchQuery = searchParams.q;

  const [categories, posts, latestPosts, notices, trendingPosts, events] = await Promise.all([
    getAllCategories(),
    searchQuery
      ? searchPosts(searchQuery)
      : activeCategory
        ? getPostsByCategory(activeCategory)
        : getAllPosts(),
    getAllPosts(),
    getNotices(),
    getTrendingPosts(),
    getEvents(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative py-16 mb-16 overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-blue-500/5">
          {/* Decorative Background Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 text-center px-6">

            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent italic decoration-blue-500/30 underline-offset-8 transition-all hover:tracking-tight">
                UNIBEN Engine Blog
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Updates, news, and insights from Nigeria's premier center for
              <span className="text-blue-600 dark:text-blue-400"> engineering excellence</span>.
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
            All
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
            {posts.length > 0 ? (
              <div className="flex flex-col gap-8 justify-center max-w-7xl mx-auto">
                {posts.map((post: any) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No posts match your search or category.
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

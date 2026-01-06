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
import { searchProfiles } from "@/lib/profiles";
import ProfileSearchCard from "@/components/ProfileSearchCard";

export const metadata: Metadata = {
  title: "Engine Blog",
  description: "Stay updated with the latest news, academic notices, and student life from the Faculty of Engineering, University of Benin.",
  openGraph: {
    title: "Engine Blog",
    description: "Stay updated with the latest news, academic notices, and student life from the Faculty of Engineering, University of Benin.",
    type: "website",
    siteName: "Engine Blog",
    images: [
      {
        url: "/og-image.png", // Make sure this exists or replace with a real link
        width: 1200,
        height: 630,
        alt: "Engine Blog - UNIBEN",
      },
    ],
  }
};

export default async function Home(props: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;

  const activeCategory = searchParams.category;
  const searchQuery = searchParams.q;

  const [categories, posts, latestPosts, notices, trendingPosts, events, profiles] = await Promise.all([
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
    searchQuery ? searchProfiles(searchQuery) : Promise.resolve([]),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 pb-12 border-b-2 border-blue-600 dark:border-blue-500">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              UNIBEN Engine Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              Your source for academic updates, engineering insights, and campus news from the University of Benin.
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
            {searchQuery && profiles.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-blue-600 rounded-full" />
                  Users
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
                    Articles
                  </h3>
                )}
                {posts.map((post: any) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No {profiles.length > 0 ? "articles" : "results"} found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search query.
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

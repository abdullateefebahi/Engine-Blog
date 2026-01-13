import { Metadata } from "next";
import {
  getAllPosts,
  getAllCategories,
  getPostsByCategory,
  searchPosts,
} from "@/lib/posts";
import { getTrendingPosts, getNotices, getEvents } from "@/lib/api";
import { searchProfiles } from "@/lib/profiles";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60;

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
        url: "/og-image.png",
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

  const INITIAL_POSTS_LIMIT = 6;

  const [categories, posts, latestPosts, notices, trendingPosts, events, profiles] = await Promise.all([
    getAllCategories(),
    searchQuery
      ? searchPosts(searchQuery, 0, INITIAL_POSTS_LIMIT)
      : activeCategory
        ? getPostsByCategory(activeCategory, 0, INITIAL_POSTS_LIMIT)
        : getAllPosts(0, INITIAL_POSTS_LIMIT),
    getAllPosts(0, 5), // Latest posts for sidebar, can keep it small
    getNotices(),
    getTrendingPosts(),
    getEvents(),
    searchQuery ? searchProfiles(searchQuery) : Promise.resolve([]),
  ]);

  return (
    <HomeClient
      categories={categories}
      posts={posts}
      latestPosts={latestPosts}
      notices={notices}
      trendingPosts={trendingPosts}
      events={events}
      profiles={profiles}
      activeCategory={activeCategory}
      searchQuery={searchQuery}
    />
  );
}

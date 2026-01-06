import { client } from "./sanity";
import { getReactionCount, getReactionCounts } from "./reactions";
import { getCommentCount, getCommentCounts } from "./comments";

// Fetch all categories
export async function getAllCategories() {
  const categories = await client.fetch(`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description
    }
  `);
  return categories;
}

// Fetch all posts
export async function getAllPosts() {
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name,
      isTrending
    }
  `);
  return posts;
}

export async function getTrendingPosts() {
  // 1. Fetch posts flagged manually OR recent posts
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0..19] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      isTrending,
      "categories": categories[]->title
    }
  `);

  // 2. Fetch engagement data for these posts in batch
  const postSlugs = posts.map((p: { slug: string }) => p.slug);
  const [allReactions, allComments] = await Promise.all([
    getReactionCounts(postSlugs),
    getCommentCounts(postSlugs)
  ]);

  interface TrendingPostData {
    _id: string;
    title: string;
    slug: string;
    publishedAt: string;
    isTrending?: boolean;
    categories: string[];
    score: number;
    reactions: number;
    comments: number;
  }

  const trendingData: TrendingPostData[] = posts.map((post: any) => {
    const reactions = allReactions[post.slug] || 0;
    const comments = allComments[post.slug] || 0;

    // Score calculation: 
    // - Manual isTrending: massive boost
    // - Comments: weight 3
    // - Reactions: weight 1
    const score = (post.isTrending ? 1000 : 0) + (comments * 3) + reactions;

    return { ...post, score, reactions, comments };
  });

  // 3. Filter by threshold (min 50 reactions) unless manually flagged as trending
  const filteredTrending = trendingData.filter((post: TrendingPostData) => post.isTrending || post.reactions >= 50);

  // 4. Sort by score and return top 5
  return filteredTrending
    .sort((a: TrendingPostData, b: TrendingPostData) => b.score - a.score)
    .slice(0, 5);
}

// Fetch posts by category
export async function getPostsByCategory(categoryTitle: string) {
  const posts = await client.fetch(`
    *[_type == "post" && $category in categories[]->title] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      "categories": categories[]->title,
      "coverImage": mainImage.asset->url,
      publishedAt,
      excerpt,
      body,
      "author": author->name
    }
  `, { category: categoryTitle });
  return posts;
}

export async function getNotices() {
  return client.fetch(`
    *[_type == "post" && isNotice == true]
    | order(publishedAt desc)[0..4] {
      title,
      "slug": slug.current,
      _id,
      publishedAt
    }
  `);
}

export async function getAllNotices() {
  return client.fetch(`
    *[_type == "post" && isNotice == true]
    | order(publishedAt desc) {
      title,
      "slug": slug.current,
      _id,
      publishedAt,
      excerpt,
      "categories": categories[]->title
    }
  `);
}

export async function getEvents() {
  return client.fetch(`
    *[_type == "post" && isEvent == true]
    | order(eventDate asc)[0..4] {
      title,
      "slug": slug.current,
      _id,
      eventDate,
      location
    }
  `);
}

export async function getAllEvents() {
  return client.fetch(`
    *[_type == "post" && isEvent == true]
    | order(eventDate asc) {
      title,
      "slug": slug.current,
      _id,
      eventDate,
      location,
      excerpt,
      "coverImage": mainImage.asset->url,
      "categories": categories[]->title
    }
  `);
}

"use server";

import { getAllPosts, getPostsByCategory, searchPosts, getPostsByAuthor } from "@/lib/posts";

export async function fetchMorePosts({
    start,
    limit = 6,
    category,
    query,
    authorSlug,
}: {
    start: number;
    limit?: number;
    category?: string;
    query?: string;
    authorSlug?: string;
}) {
    const end = start + limit;

    if (authorSlug) {
        return await getPostsByAuthor(authorSlug, start, end);
    }

    if (query) {
        return await searchPosts(query, start, end);
    }

    if (category) {
        return await getPostsByCategory(category, start, end);
    }

    return await getAllPosts(start, end);
}

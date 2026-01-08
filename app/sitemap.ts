import { MetadataRoute } from 'next';
import { getAllPosts, getAllAuthors } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://engineblog.live';

    // Get all posts
    const posts = await getAllPosts();
    const postUrls = posts.map((post: any) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Get all authors (Sanity authors)
    const authors = await getAllAuthors();
    const authorUrls = authors.map((author: any) => ({
        url: `${baseUrl}/authors/${author.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Static routes
    const routes = [
        '',
        '/about',
        '/posts',
        '/authors',
        '/events',
        '/notices',
        '/guidelines',
        '/privacy',
        '/terms',
        '/credits',
        '/sign-in',
        '/sign-up',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.7,
    }));

    return [...routes, ...postUrls, ...authorUrls];
}

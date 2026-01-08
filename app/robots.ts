import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://engineblog.live';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/studio/', '/profile/'], // Disallow API routes, Sanity Studio, and private profile settings
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

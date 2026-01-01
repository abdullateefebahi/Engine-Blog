import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Engine Blog',
        short_name: 'Engine',
        description: 'Updates, news, and insights from the Faculty of Engineering, University of Benin.',
        start_url: '/',
        display: 'standalone',
        background_color: '#030712',
        theme_color: '#2563eb',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}

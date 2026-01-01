"use client";

import { useEffect } from 'react';

export default function LoaderRegistrar() {
    useEffect(() => {
        async function register() {
            const { lineSpinner } = await import('ldrs');
            lineSpinner.register();
        }
        register();
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => console.log('SW registered: ', registration),
                    (error) => console.log('SW registration failed: ', error)
                );
            });
        }
    }, []);

    return null;
}

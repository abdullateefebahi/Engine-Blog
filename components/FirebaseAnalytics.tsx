'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, logAnalyticsEvent } from '@/lib/firebase';

function AnalyticsLogic() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        initAnalytics();
    }, []);

    useEffect(() => {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        logAnalyticsEvent('page_view', {
            page_path: url,
            page_location: window.location.href,
            page_title: document.title
        });
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as Element).closest('button, a');
            if (target) {
                const isLink = target.tagName === 'A';
                const label = target.getAttribute('aria-label') || target.getAttribute('title') || (target as HTMLElement).innerText || '';
                const id = target.id || '';
                const className = target.className || '';

                logAnalyticsEvent('click', {
                    component: isLink ? 'link' : 'button',
                    label: label.slice(0, 50), // Limit length
                    id: id,
                    class: className.slice(0, 50),
                    href: isLink ? (target as HTMLAnchorElement).href : undefined
                });
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return null;
}

export default function FirebaseAnalytics() {
    return (
        <Suspense fallback={null}>
            <AnalyticsLogic />
        </Suspense>
    );
}

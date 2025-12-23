"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { logAnalyticsEvent } from "@/lib/firebase";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set("q", query);
            logAnalyticsEvent('search', { search_term: query });
        } else {
            params.delete("q");
        }
        // Clear category when searching to show all results matching query
        params.delete("category");
        router.push(`/?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full px-5 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
        </form>
    );
}

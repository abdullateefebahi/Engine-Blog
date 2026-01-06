"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 -left-20 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full text-center relative z-10">
                <div className="mb-8 relative inline-block">
                    <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-5xl border border-gray-100 dark:border-gray-700 mx-auto">
                        ⚠️
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-gray-50 dark:border-gray-900 animate-pulse" />
                </div>

                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                    Something went wrong
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-10 font-medium leading-relaxed">
                    We encountered an unexpected error. Our team has been notified.
                    <br />
                    <span className="text-xs opacity-50 block mt-2 font-mono">
                        {error.digest && `Error ID: ${error.digest}`}
                    </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-blue-500/40 active:scale-95"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PostCoverImageProps {
    src: string;
    alt: string;
}

export default function PostCoverImage({ src, alt }: PostCoverImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <div
                className="mb-8 relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 cursor-zoom-in group"
                onClick={() => setIsOpen(true)}
            >
                {/* Blurred Background */}
                <div className="absolute inset-0">
                    <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover blur-2xl opacity-50 scale-110"
                        priority
                    />
                </div>
                {/* Primary Image */}
                <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-[1.02]">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative w-[95vw] h-[95vh] flex items-center justify-center p-4">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            quality={100}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

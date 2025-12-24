"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LightboxImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    showBlurBackground?: boolean;
}

export default function LightboxImage({
    src,
    alt,
    width,
    height,
    className,
    showBlurBackground = false
}: LightboxImageProps) {
    const [isOpen, setIsOpen] = useState(false);

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
                className={`relative cursor-zoom-in group overflow-hidden ${className}`}
                onClick={() => setIsOpen(true)}
            >
                {showBlurBackground && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover blur-3xl opacity-100 scale-125"
                            priority
                        />
                    </div>
                )}
                <div className="relative w-full h-full z-10">
                    <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        fill={!width && !height}
                        className={`${showBlurBackground ? 'object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-[1.02]`}
                    />
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
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

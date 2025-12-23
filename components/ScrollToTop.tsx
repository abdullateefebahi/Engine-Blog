"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top coordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-[60]">
            <button
                type="button"
                onClick={scrollToTop}
                className={`
                    flex items-center justify-center w-12 h-12 rounded-2xl
                    bg-blue-600 hover:bg-blue-700 text-white shadow-2xl
                    hover:shadow-blue-500/40 transition-all duration-300
                    active:scale-90 transform
                    ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50 pointer-events-none"}
                `}
                aria-label="Scroll to top"
            >
                <FontAwesomeIcon icon={faArrowUp} className="text-lg" />

                {/* Subtle outer pulse effect */}
                {isVisible && (
                    <span className="absolute inset-0 rounded-2xl bg-blue-500/30 animate-ping -z-10"></span>
                )}
            </button>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const AutoTranslator = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        // 1. Define the callback for Google Translate
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,fr,es,de,pt,ar,zh-CN,hi,yo,ig,ha",
                    autoDisplay: false,
                },
                "google_translate_hidden"
            );
        };

        // 2. Setup Observation to hide legacy UI elements aggressively
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node: any) => {
                    // Hide the top bar and popups
                    if (node.id === "goog-gt-tt" || node.className?.includes("goog-te-banner-frame")) {
                        node.style.setProperty('display', 'none', 'important');
                    }
                    if (node.className?.includes("skiptranslate") && node.id !== "google_translate_hidden") {
                        node.style.setProperty('display', 'none', 'important');
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 3. Sync listener for our custom footer UI
        const handleTranslateEvent = (e: any) => {
            const targetLang = e.detail;
            const selectField = document.querySelector(".goog-te-combo") as HTMLSelectElement;
            if (selectField) {
                selectField.value = targetLang;
                selectField.dispatchEvent(new Event("change"));
            }
        };

        window.addEventListener("translate-to", handleTranslateEvent);

        // 4. Auto-detection logic (still active)
        const detectAndTranslate = async () => {
            try {
                const languages = (navigator.languages || [navigator.language]).map(l => l.split('-')[0].toLowerCase());
                const supportedLanguages = ["fr", "es", "de", "pt", "ar", "zh", "hi", "yo", "ig", "ha"];
                const preferredLang = languages.find(lang => supportedLanguages.includes(lang));

                if (preferredLang) {
                    const targetLang = preferredLang === "zh" ? "zh-CN" : preferredLang;

                    const checkTranslate = setInterval(() => {
                        const selectField = document.querySelector(".goog-te-combo") as HTMLSelectElement;
                        if (selectField) {
                            clearInterval(checkTranslate);
                            if (selectField.value !== targetLang) {
                                selectField.value = targetLang;
                                selectField.dispatchEvent(new Event("change"));
                                // Dispatch event to update our footer UI state too
                                window.dispatchEvent(new CustomEvent("translate-updated", { detail: targetLang }));
                            }
                        }
                    }, 500);

                    setTimeout(() => clearInterval(checkTranslate), 15000);
                }
            } catch (err) {
                console.error("Translation detection error:", err);
            }
        };

        detectAndTranslate();

        return () => {
            observer.disconnect();
            window.removeEventListener("translate-to", handleTranslateEvent);
        };
    }, [isMounted]);

    if (!isMounted) return null;

    return (
        <>
            {/* The real google translate gadget, completely hidden */}
            <div id="google_translate_hidden" style={{ display: 'none', position: 'fixed', top: -100, left: -100 }}></div>

            <Script
                id="google-translate-script"
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                /* Final blow to the Google Bar */
                .goog-te-banner-frame,
                .goog-te-banner,
                #goog-gt-tt,
                .goog-te-balloon-frame,
                .goog-tooltip,
                .goog-tooltip:hover,
                .goog-te-spinner-pos,
                .skiptranslate:not(#google_translate_hidden) {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }

                body {
                    top: 0 !important;
                    position: static !important;
                    margin-top: 0 !important;
                }
            `}} />
        </>
    );
};

export default AutoTranslator;

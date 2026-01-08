"use client";

import { useState, useEffect } from "react";

import Script from "next/script";

const GoogleAdsense = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="w-full my-4 overflow-hidden text-center">
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9880476141412049"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
            {/* ads1 */}
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-9880476141412049"
                data-ad-slot="8356381943"
                data-ad-format="auto"
                data-full-width-responsive="true"
                suppressHydrationWarning
            />
            <Script id="google-adsense-init" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
        </div>
    );
};

export default GoogleAdsense;

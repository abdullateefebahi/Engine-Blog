"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GoogleFeedAd = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="w-full my-4 overflow-hidden text-center">
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9880476141412049"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
            {!isMounted ? null : (
                <>
                    <ins
                        className="adsbygoogle"
                        style={{ display: "block" }}
                        data-ad-format="fluid"
                        data-ad-layout-key="-fb+5w+4e-db+86"
                        data-ad-client="ca-pub-9880476141412049"
                        data-ad-slot="1405311854"
                        suppressHydrationWarning
                    />
                    <Script id="google-feed-ad-init" strategy="afterInteractive">
                        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                    </Script>
                </>
            )}
        </div>
    );
};

export default GoogleFeedAd;

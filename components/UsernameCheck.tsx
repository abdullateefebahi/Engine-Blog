"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function UsernameCheck() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoaded) return;

        // If user is logged in but has no username, and is NOT on onboarding page
        if (user && !user.username) {
            if (pathname !== "/onboarding" && pathname !== "/sso-callback") {
                router.replace("/onboarding");
            }
        }
        // If user is logged in, HAS a username, but is ON the onboarding page
        else if (user && user.username) {
            if (pathname === "/onboarding") {
                router.replace("/");
            }
        }
    }, [user, isLoaded, pathname, router]);

    return null;
}

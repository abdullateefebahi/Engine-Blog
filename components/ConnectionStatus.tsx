"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ConnectionStatus() {
    useEffect(() => {
        const handleOnline = () => {
            toast.success("Back online!", {
                id: "connection-status",
                duration: 3000,
                icon: "🌐",
            });
        };

        const handleOffline = () => {
            toast.error("You are currently offline.", {
                id: "connection-status",
                duration: Infinity,
                icon: "📶",
            });
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Check initial state
        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return null;
}

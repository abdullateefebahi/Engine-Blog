import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBaq7zo2dOjxPu2IweVqq7MN8-gC4J7ldA",
    authDomain: "eng-blog-482004.firebaseapp.com",
    projectId: "eng-blog-482004",
    storageBucket: "eng-blog-482004.firebasestorage.app",
    messagingSenderId: "729905401266",
    appId: "1:729905401266:web:669d5540b4bdf175d968ab",
    measurementId: "G-RN1FLEH4P4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const initAnalytics = async () => {
    if (typeof window !== "undefined" && await isSupported()) {
        return getAnalytics(app);
    }
    return null;
};

const logAnalyticsEvent = async (eventName: string, eventParams?: { [key: string]: any }) => {
    if (typeof window === "undefined") return;

    try {
        const analyticsInstance = await initAnalytics();
        if (analyticsInstance) {
            logEvent(analyticsInstance, eventName, eventParams);
        }
    } catch (e) {
        console.error("Analytics Error:", e);
    }
};

export { app, initAnalytics, logAnalyticsEvent };

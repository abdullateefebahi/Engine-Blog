import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCerT9hzXIEFRFa7Sb6e3MXUDIA7OJWQmM",
    authDomain: "engine-blog234.firebaseapp.com",
    projectId: "engine-blog234",
    storageBucket: "engine-blog234.firebasestorage.app",
    messagingSenderId: "283883788684",
    appId: "1:283883788684:web:310f7105d7694b31c29ea9",
    measurementId: "G-X41HFX0H9V"
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

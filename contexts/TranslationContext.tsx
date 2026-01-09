"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../messages/en.json";
import fr from "../messages/fr.json";

type Messages = typeof en;
type Locale = "en" | "fr";

interface TranslationContextType {
    t: (path: string, variables?: Record<string, any>) => string;
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const messages: Record<Locale, any> = { en, fr };

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>("en");

    // Detect browser language on mount
    useEffect(() => {
        const savedLocale = localStorage.getItem("locale") as Locale;
        if (savedLocale && (savedLocale === "en" || savedLocale === "fr")) {
            setLocale(savedLocale);
        } else {
            const browserLang = navigator.language.split("-")[0];
            if (browserLang === "fr") {
                setLocale("fr");
            }
        }
    }, []);

    const changeLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem("locale", newLocale);
        document.documentElement.lang = newLocale;
    };

    const t = (path: string, variables?: Record<string, any>) => {
        const keys = path.split(".");
        let value = messages[locale];

        for (const key of keys) {
            value = value?.[key];
        }

        if (typeof value !== "string") return path;

        if (variables) {
            Object.entries(variables).forEach(([key, val]) => {
                value = (value as string).replace(`{${key}}`, val.toString());
            });
        }

        return value as string;
    };

    return (
        <TranslationContext.Provider value={{ t, locale, setLocale: changeLocale }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error("useTranslation must be used within a TranslationProvider");
    }
    return context;
};

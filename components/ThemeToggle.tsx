"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon, faDesktop } from "@fortawesome/free-solid-svg-icons"

export default function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Render a placeholder to avoid layout shift
        return (
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 opacity-0">
                <div className="w-7 h-7" />
                <div className="w-7 h-7" />
                <div className="w-7 h-7" />
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setTheme("light")}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 ${theme === "light"
                        ? "bg-white text-yellow-500 shadow-sm scale-110"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                aria-label="Light Mode"
                title="Light Mode"
            >
                <FontAwesomeIcon icon={faSun} className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 ${theme === "system"
                        ? "bg-white dark:bg-gray-600 text-blue-500 shadow-sm scale-110"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                aria-label="System Mode"
                title="System Mode"
            >
                <FontAwesomeIcon icon={faDesktop} className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 ${theme === "dark"
                        ? "bg-gray-700 text-purple-400 shadow-sm scale-110"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                aria-label="Dark Mode"
                title="Dark Mode"
            >
                <FontAwesomeIcon icon={faMoon} className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}

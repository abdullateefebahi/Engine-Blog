"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { submitOnboardingAction } from "@/app/actions/onboarding";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function OnboardingPage() {
    const [username, setUsername] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { user } = useUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) return;

        startTransition(async () => {
            try {
                await submitOnboardingAction(new FormData(e.target as HTMLFormElement));
                await user?.reload();
                toast.success("Welcome aboard!");
                router.push("/");
                router.refresh();
            } catch (error: any) {
                toast.error(error.message || "Something went wrong");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                            Create your Username
                        </h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                            Welcome to Engine Blog! Please choose a unique username to continue.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.trim())}
                                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="username"
                                    minLength={4}
                                    maxLength={20}
                                />
                            </div>
                            <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-500">
                                Username must be between 4-20 characters and contain only lowercase letters, numbers, and underscores.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || !username}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Complete Setup"
                            )}
                        </button>
                    </form>
                </div>

                {/* Decorative footer/bg element */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600" />
            </motion.div>
        </div>
    );
}

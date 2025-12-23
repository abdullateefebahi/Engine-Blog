"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                setMessage({ type: "success", text: "Signed in successfully! Redirecting..." });
                setTimeout(() => router.push("/"), 1500);
            } else if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}`,
                        data: {
                            username: username,
                        }
                    }
                });
                if (error) throw error;
                setMessage({ type: "success", text: "Check your email for a confirmation link!" });
            } else if (mode === "forgot") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                });
                if (error) throw error;
                setMessage({ type: "success", text: "Password reset link sent to your email!" });
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            {/* Background mesh gradients */}
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px] rounded-full" />

            <div className="max-w-md w-full space-y-8 relative z-10 transition-all duration-500">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Engine Blog
                        </span>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {mode === "login"
                            ? "Enter your credentials to access your account"
                            : mode === "signup"
                                ? "Join the community to interact with posts"
                                : "Enter your email to receive a reset link"}
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-4">
                            {mode === "signup" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 mb-1.5">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="johndoe"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                                    required
                                />
                            </div>
                            {mode !== "forgot" && (
                                <div>
                                    <div className="flex items-center justify-between ml-1 mb-1.5">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        {mode === "login" && (
                                            <button
                                                type="button"
                                                onClick={() => setMode("forgot")}
                                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm ${message.type === "success"
                                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800"
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </button>
                    </div>

                    <div className="mt-8 text-center space-y-3">
                        {mode === "forgot" ? (
                            <button
                                onClick={() => setMode("login")}
                                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                            >
                                Back to Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                            >
                                {mode === "login"
                                    ? "Don't have an account? Create one"
                                    : "Already have an account? Sign in"}
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 dark:text-gray-500 px-8">
                    By continuing, you agree to our <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}

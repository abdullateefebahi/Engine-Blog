"use client";
import { useState, useEffect } from "react";
import { useSignIn, useSignUp, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface AuthScreenProps {
    initialMode?: "login" | "signup" | "forgot" | "verify" | "reset";
}

export default function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
    const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
    const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
    const { user, isLoaded: userLoaded, isSignedIn } = useUser();
    const clerk = useClerk();

    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState(""); // For signup verification
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Redirect if already signed in, but ONLY if we are not in the middle of a verification flow.
    useEffect(() => {
        const ticket = searchParams.get("__clerk_ticket");
        const status = searchParams.get("__clerk_status");

        // If these params exist, let the verification effect handle the flow.
        if (ticket || status) return;

        if (userLoaded && isSignedIn) {
            router.push("/");
        }
    }, [userLoaded, isSignedIn, router, searchParams]);

    // Handle magic link verification and errors
    useEffect(() => {
        const handleVerification = async () => {
            const ticket = searchParams.get("__clerk_ticket");
            const status = searchParams.get("__clerk_status");

            if (status === "client_mismatch" && !ticket) {
                // This happens when the user opens the verification link on a different device/browser.
                // Clerk redirects back with this status. Without the ticket, we can't automate it easily,
                // but we should explain the situation clearly.
                setMessage({
                    type: "error",
                    text: "Device mismatch detected. For security, please complete the verification on the same device and browser where you started signing up.",
                });
                setMode("login");
                return;
            }

            if (ticket && clerk && !isSignedIn) {
                setLoading(true);
                setMode("verify");

                // If it's a cross-device flow, inform the user but continue
                if (status === "client_mismatch") {
                    setMessage({
                        type: "success",
                        text: "Verifying your account on this device..."
                    });
                }
                try {
                    // Optimized for custom flow: this handles both signup and signin email links
                    // and correctly handles cross-device verification.
                    await clerk.handleEmailLinkVerification({
                        redirectUrlComplete: "/",
                        redirectUrl: "/"
                    });
                } catch (err: any) {
                    console.error("Verification error:", err);
                    setMessage({
                        type: "error",
                        text: err.errors?.[0]?.message || "This verification link is invalid or has expired."
                    });
                    // Stay on login so they can retry or see the error
                    setMode("login");
                } finally {
                    setLoading(false);
                }
            }
        };
        handleVerification();
    }, [searchParams, clerk, isSignedIn, router]);

    const handleGoogleSignIn = async () => {
        if (!signInLoaded) return;
        setLoading(true);
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err: any) {
            setMessage({ type: "error", text: err.errors?.[0]?.message || "Google sign-in failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleAppleSignIn = async () => {
        if (!signInLoaded) return;
        setLoading(true);
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_apple",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err: any) {
            setMessage({ type: "error", text: err.errors?.[0]?.message || "Apple sign-in failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure SDKs are loaded before proceeding, but set loading to false if not.
        if (!signInLoaded || !signUpLoaded) {
            setLoading(false); // Ensure loading state is reset if SDKs aren't ready
            return;
        }

        setMessage(null);
        setLoading(true);

        try {
            if (mode === "login") {
                const result = await signIn.create({
                    identifier: email.trim().toLowerCase(),
                    password,
                });

                if (result.status === "complete") {
                    await setSignInActive({ session: result.createdSessionId });
                    router.push("/");
                } else {
                    // Handle other statuses (e.g., MFA, verification required)
                    console.warn("SignIn status not complete:", result.status);
                    if (result.status === "needs_first_factor") {
                        setMessage({ type: "error", text: "Please verify your email or check for additional requirements." });
                    } else {
                        setMessage({ type: "error", text: `Sign in incomplete: ${result.status}. Please contact support.` });
                    }
                }
            } else if (mode === "signup") {
                // Clear any existing signup attempt and start fresh
                const result = await signUp.create({
                    emailAddress: email.trim().toLowerCase(),
                    password,
                    username: username.trim() || undefined,
                    firstName: firstName.trim() || undefined,
                    lastName: lastName.trim() || undefined,
                });

                if (result.status === "missing_requirements") {
                    await signUp.prepareEmailAddressVerification({
                        strategy: "email_link",
                        redirectUrl: window.location.origin + "/sign-up"
                    });
                    setMode("verify");
                    setMessage({ type: "success", text: "A verification link has been sent to your email. Please click it to complete your registration." });
                } else if (result.status === "complete") {
                    await setSignUpActive({ session: result.createdSessionId });
                    router.push("/");
                }
            } else if (mode === "verify") {
                // For code verification if strategy was email_code
                const result = await signUp.attemptEmailAddressVerification({
                    code,
                });
                if (result.status === "complete") {
                    await setSignUpActive({ session: result.createdSessionId });
                    router.push("/");
                }
            } else if (mode === "forgot") {
                await signIn.create({
                    strategy: "reset_password_email_code",
                    identifier: email.trim().toLowerCase(),
                });
                setMessage({ type: "success", text: "Code sent! Check your email." });
                setMode("reset");
            } else if (mode === "reset") {
                const result = await signIn.attemptFirstFactor({
                    strategy: "reset_password_email_code",
                    code,
                    password: password,
                });

                if (result.status === "complete") {
                    await setSignInActive({ session: result.createdSessionId });
                    toast.success("Password reset successfully!");
                    router.push("/");
                }
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            const errorMessage = err.errors?.[0]?.message || err.message || "Authentication failed";
            setMessage({ type: "error", text: errorMessage });
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
                        {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : mode === "verify" ? "Verify Email" : mode === "forgot" ? "Forgot Password" : "Reset Password"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {mode === "login"
                            ? "Enter your credentials to access your account"
                            : mode === "signup"
                                ? "Join the community to interact with posts"
                                : mode === "verify"
                                    ? "Enter the code sent to your email"
                                    : mode === "forgot"
                                        ? "Enter your email to receive a reset link"
                                        : "Enter the code and your new password"}
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
                    {loading && searchParams.get("__clerk_ticket") ? (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-gray-900 dark:text-white font-semibold">Verifying your link...</p>
                            <p className="text-sm text-gray-500">Completing your registration. Please wait...</p>
                        </div>
                    ) : (
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

                                {mode === "signup" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 mb-1.5">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="John"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 mb-1.5">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Doe"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}



                                {(mode !== "verify" && mode !== "reset") && (
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
                                )}

                                {mode === "verify" && (
                                    <div className="text-center py-4">
                                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                            We've sent a magic link to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
                                            Click the link in the email to verify your account and sign in.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                signUp?.prepareEmailAddressVerification({
                                                    strategy: "email_link",
                                                    redirectUrl: window.location.origin + "/sign-up"
                                                });
                                                setMessage({ type: "success", text: "New verification link sent!" });
                                            }}
                                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 uppercase tracking-widest"
                                        >
                                            Resend Magic Link
                                        </button>
                                    </div>
                                )}

                                {mode === "reset" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 mb-1.5">
                                            Reset Code
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="123456"
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                                            required
                                        />
                                    </div>
                                )}

                                {(mode === "login" || mode === "signup" || mode === "reset") && (
                                    <div>
                                        <div className="flex items-center justify-between ml-1 mb-1.5">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {mode === "reset" ? "New Password" : "Password"}
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
                                        <div className="relative group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white pr-12"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                                            </button>
                                        </div>
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

                            {mode !== "verify" && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : "Reset Password"
                                    )}
                                </button>
                            )}

                            {/* Clerk CAPTCHA element - required for bot protection in custom flows */}
                            <div id="clerk-captcha" className="mt-4"></div>
                        </form>
                    )}

                    {mode !== "verify" && (
                        <>
                            <div className="mt-6 relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 uppercase tracking-wider text-[10px] font-bold">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                                <button
                                    onClick={handleAppleSignIn}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.69-.93.95 0 1.93.29 2.6.74-.66.86-1.57 2.07-1.57 3.92 0 2.39 1.74 3.24 1.76 3.26-.01.03-.69 2.4-2.56 5.14zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.04 4.16-3.74 4.25z" />
                                    </svg>
                                    Apple
                                </button>
                            </div>
                        </>
                    )}

                    <div className="mt-8 text-center space-y-3">
                        {mode === "forgot" || mode === "verify" || mode === "reset" ? (
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

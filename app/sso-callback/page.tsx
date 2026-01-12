import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] dark:bg-gray-900 px-4">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />

                <div className="relative flex flex-col items-center gap-8">
                    {/* Spinning Loader */}
                    <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
                    </div>

                    <div className="text-center space-y-3">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                            Finalizing Authentication
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                            Please wait while we connect your account...
                        </p>
                    </div>

                    {/* Clerk Callback Component */}
                    <div className="hidden">
                        <AuthenticateWithRedirectCallback
                            signInFallbackRedirectUrl="/"
                            signUpFallbackRedirectUrl="/onboarding"
                        />
                    </div>
                </div>
            </div>

            {/* Branding */}
            <div className="fixed bottom-12 flex flex-col items-center leading-none opacity-50">
                <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                    Engine
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-gray-500">
                    Blog
                </span>
            </div>
        </div>
    );
}

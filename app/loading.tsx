import LoaderRegistrar from "@/components/LoaderRegistrar";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 backdrop-blur-3xl">
            {/* Premium Glass Card for Loader */}
            <div className="p-12 rounded-[3rem] bg-gray-900/90 dark:bg-blue-600/10 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center group">
                <div className="relative mb-6">
                    <l-line-spinner
                        size="45"
                        stroke="3"
                        speed="1"
                        color="#f4f5f8"
                    ></l-line-spinner>
                    {/* Subtle Glow */}
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl -z-10 animate-pulse"></div>
                </div>

                <p className="text-[11px] font-black text-gray-400 dark:text-blue-300 transition-colors uppercase tracking-[0.3em] ml-[0.3em] animate-pulse">
                    loading...
                </p>
            </div>
        </div>
    );
}

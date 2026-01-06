import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 -left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl w-full text-center relative z-10">
                <div className="mb-8 relative">
                    <h2 className="text-[12rem] md:text-[16rem] font-black text-white dark:text-gray-800 leading-none select-none tracking-tighter opacity-50">
                        404
                    </h2>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl flex items-center justify-center text-6xl border border-gray-100 dark:border-gray-700 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            🔍
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
                    Lost in the <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Circuits?</span>
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                    The page you are looking for seems to have been disconnected from our grid. Let&apos;s get you back on track.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[2rem] transition-all shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 text-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l-7-7m7 7h18" />
                    </svg>
                    Back to Homepage
                </Link>
            </div>
        </div>
    );
}

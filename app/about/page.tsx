import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Engine Blog, the official digital heartbeat of the Faculty of Engineering at the University of Benin.",
    openGraph: {
        title: "About Us | Engine Blog",
        description: "Learn about Engine Blog, the official digital heartbeat of the Faculty of Engineering at the University of Benin.",
    }
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">About</span>
                </nav>

                <div className="relative mb-16 overflow-hidden rounded-[3rem] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 shadow-2xl p-12 md:p-20 text-center">
                    {/* Decorative Background Glows */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                            <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                                Our Mission
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-gray-900 dark:text-white leading-tight">
                            Voice of the <br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Engineering Community</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            Engine Blog is the official digital heartbeat of the Faculty of Engineering at the University of Benin.
                            We bridge the gap between rigorous academia and vibrant student life.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6">📰</div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Academic Excellence</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Stay updated with the latest research, faculty achievements, and official academic notices from the dean's office.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6">🎭</div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Student Life</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            From engineering week celebrations to student union news, we capture the diverse culture and events of our engineering family.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Ready to Contribute?</h2>
                        <p className="text-blue-100 mb-10 text-lg">
                            We are always looking for fresh voices. Whether it's an article about your project or a coverage of an event, reach out!
                        </p>
                        <Link
                            href="mailto:contact@engineblog.uniben.edu"
                            className="inline-flex px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import icon from "@/public/icon.png";

export const metadata: Metadata = {
    title: "Credits",
    description: "The brilliant minds and technology behind Engine Blog.",
    openGraph: {
        title: "Credits | Engine Blog",
        description: "The brilliant minds and technology behind Engine Blog.",
    }
};

export default function CreditsPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Credits</span>
                </nav>

                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                        <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                            The Team Behind the Project
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
                        Engineering the <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">Future.</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Recognizing the developers, designers, and contributors who brought this platform to life for the UNIBEN Engineering community.
                    </p>
                </div>

                {/* Core Team Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            🧠
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Abdullateef Ebahi Musa</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Project Visionary & Originator</p>
                        <div className="flex gap-4">
                            <a href="https://github.com/abdullateefebahi" className="text-gray-400 font-bold text-sm hover:underline">GitHub</a>
                        </div>
                    </div>

                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            👨‍💻
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ohiocheoya Alabi</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Lead Developer & Architect</p>
                        <div className="flex gap-4">
                            <a href="https://linkedin.com/in/ohiocheoya" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">LinkedIn</a>
                            <a href="https://github.com/Alabiohio" className="text-gray-400 font-bold text-sm hover:underline">GitHub</a>
                        </div>
                    </div>

                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            🎨
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">UI/UX Designer</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Visual Identity & Experience</p>
                        <div className="flex gap-4">
                            <a href="#" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Behance</a>
                        </div>
                    </div>

                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            🖊️
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Author</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Head Writer & Research</p>
                    </div>

                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            ✨
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Israel Edeh</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Logo Designer</p>
                    </div>

                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            💡
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Content Strategy</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Editor & Communication</p>
                    </div>

                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            🙌
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Key Contributors</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Alexander Agbor, Israel Edeh</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Creative Suggestions & Testing</p>
                    </div>
                </div>

                {/* Tech Stack Section */}
                <div className="bg-white dark:bg-gray-800/40 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden mb-24">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Image src={icon} alt="Logo" width={150} height={150} />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-12 tracking-tighter">Tools of the Trade</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Framework</span>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Next.js 15</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Database</span>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Supabase</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">CMS</span>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Sanity.io</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Styling</span>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Tailwind CSS</p>
                        </div>
                    </div>
                </div>

                {/* Partners / Special Thanks */}
                <div className="text-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-12">Special Thanks</h3>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        <span className="text-2xl font-black text-gray-900 dark:text-white">UNIBEN</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">Faculty of Engr.</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">MTE240</span>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">Ohio Codespace</span>
                    </div>
                </div>
            </div>
        </main>
    );
}

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
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 p-8 opacity-5 pointer-events-none animate-float">
                <Image src={icon} alt="Logo" width={200} height={200} className="animate-blur-flux" style={{ animationDelay: '0s' }} />
            </div>
            <div className="absolute bottom-20 right-10 p-8 opacity-5 pointer-events-none rotate-12 animate-drift">
                <Image src={icon} alt="Logo" width={300} height={300} className="animate-blur-flux" style={{ animationDelay: '2s' }} />
            </div>
            <div className="absolute top-1/2 -left-20 p-8 opacity-5 pointer-events-none -rotate-45 animate-spin-slow">
                <Image src={icon} alt="Logo" width={400} height={400} className="animate-blur-flux" style={{ animationDelay: '4s' }} />
            </div>
            <div className="absolute top-40 right-20 p-8 opacity-[0.03] pointer-events-none rotate-180 animate-float">
                <Image src={icon} alt="Logo" width={150} height={150} className="animate-blur-flux" style={{ animationDelay: '1.5s' }} />
            </div>
            {/* Additional Decorations */}
            <div className="absolute bottom-1/3 left-10 p-8 opacity-[0.04] pointer-events-none rotate-90 animate-spin-reverse-slow">
                <Image src={icon} alt="Logo" width={250} height={250} className="animate-blur-flux" style={{ animationDelay: '5s' }} />
            </div>
            <div className="absolute top-20 left-1/2 p-8 opacity-[0.02] pointer-events-none -rotate-12 translate-x-20 animate-drift">
                <Image src={icon} alt="Logo" width={180} height={180} />
            </div>
            <div className="absolute bottom-10 left-1/3 p-8 opacity-[0.03] pointer-events-none rotate-45 animate-pulse-slow">
                <Image src={icon} alt="Logo" width={120} height={120} className="animate-blur-flux" style={{ animationDelay: '3s' }} />
            </div>
            <div className="absolute top-1/3 right-10 p-8 opacity-[0.04] pointer-events-none -rotate-90 animate-float">
                <Image src={icon} alt="Logo" width={220} height={220} />
            </div>

            {/* Even More Decorations */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none z-0 animate-spin-slow">
                <Image src={icon} alt="Logo" width={800} height={800} className="animate-blur-flux" style={{ animationDelay: '6s' }} />
            </div>
            <div className="absolute top-5 left-1/4 opacity-[0.03] pointer-events-none rotate-45 animate-float">
                <Image src={icon} alt="Logo" width={60} height={60} className="animate-blur-flux" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute bottom-5 right-1/4 opacity-[0.03] pointer-events-none -rotate-45 animate-drift">
                <Image src={icon} alt="Logo" width={80} height={80} className="animate-blur-flux" style={{ animationDelay: '2.5s' }} />
            </div>
            <div className="absolute top-1/4 right-5 opacity-[0.04] pointer-events-none rotate-12 animate-spin-slow">
                <Image src={icon} alt="Logo" width={100} height={100} />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
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
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Ohiocheoya Alabi</p>
                        <div className="flex gap-4">
                            <a href="mailto:ohiocodespace@gmail.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Email</a>
                        </div>
                    </div>

                    <div className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                            ✨
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Israel Edeh</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Logo Designer</p>
                        <div className="flex gap-4">
                            <a href="mailto:piedeh992@gmail.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 font-bold text-sm hover:underline">Email</a>
                            <a href="https://wa.me/2347038200162" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 font-bold text-sm hover:underline">WhatsApp</a>
                        </div>
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

                {/* Partners / Special Thanks */}
                <div className="text-center relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Image src={icon} alt="Logo" width={150} height={150} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-12">Special Thanks</h3>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        <a href="https://github.com/Ghosty-s-Lab-Inc" target="_blank" rel="noopener noreferrer" className="text-2xl font-black text-gray-900 dark:text-white">Ghosty's Lab</a>
                        <a href="https://ohiocodespace.vercel.app" target="_blank" rel="noopener noreferrer" className="text-2xl font-black text-gray-900 dark:text-white">Ohio Codespace</a>
                        <a href="https://ag-tech.web.app" target="_blank" rel="noopener noreferrer" className="text-2xl font-black text-gray-900 dark:text-white">A&G Tech</a>
                    </div>
                </div>
            </div>
        </main>
    );
}

import { Metadata } from "next";
import Link from "next/link";
import { CardContainer, CardBody, CardItem } from "@/components/ThreeDCard";

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
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 relative overflow-hidden">
            {/* Live Interactive Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* 1. Moving Mesh Gradient Layer */}
                <div className="absolute inset-0 w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_30%)] animate-mesh blur-3xl opacity-60 dark:opacity-40" />

                {/* 2. Moving 3D Grid Layer */}
                <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.07]">
                    <div className="absolute inset-[-100%] w-[300%] h-[300%] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:60px_60px] animate-grid-move origin-bottom" />
                </div>

                {/* 3. Spotlights / Vingette */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/80 dark:to-gray-900/80" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 dark:to-gray-900/80" />
            </div>
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">About</span>
                </nav>

                <CardContainer className="inter-var mb-16 w-full">
                    <CardBody className="relative w-full h-auto rounded-[3rem] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 shadow-2xl p-12 md:p-20 text-center">
                        {/* Decorative Background Glows */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <CardItem translateZ="50" className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                                <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                                    Our Mission
                                </span>
                            </CardItem>
                            <CardItem translateZ="60" className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-gray-900 dark:text-white leading-tight">
                                Voice of the <br />
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Engineering Community</span>
                            </CardItem>
                            <CardItem translateZ="40" className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                                Engine Blog is the official digital heartbeat of the Faculty of Engineering at the University of Benin.
                                We bridge the gap between rigorous academia and vibrant student life.
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <CardContainer className="inter-var w-full h-full">
                        <CardBody className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm w-full h-full">
                            <CardItem translateZ="30" className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6">📰</CardItem>
                            <CardItem translateZ="40" className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Academic Excellence</CardItem>
                            <CardItem translateZ="20" className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Stay updated with the latest research, faculty achievements, and official academic notices from the dean's office.
                            </CardItem>
                        </CardBody>
                    </CardContainer>

                    <CardContainer className="inter-var w-full h-full">
                        <CardBody className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm w-full h-full">
                            <CardItem translateZ="30" className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6">🎭</CardItem>
                            <CardItem translateZ="40" className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Student Life</CardItem>
                            <CardItem translateZ="20" className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                From engineering week celebrations to student union news, we capture the diverse culture and events of our engineering family.
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>

                <CardContainer className="inter-var w-full">
                    <CardBody className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl w-full h-auto">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                        <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
                            <CardItem translateZ="50" className="text-3xl font-bold mb-6">Ready to Contribute?</CardItem>
                            <CardItem translateZ="30" className="text-blue-100 mb-10 text-lg">
                                We are always looking for fresh voices. Whether it's an article about your project or a coverage of an event, reach out!
                            </CardItem>
                            <CardItem translateZ="60">
                                <Link
                                    href="mailto:ohiocodespace@gmail.com"
                                    className="inline-flex px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                                >
                                    Get in Touch
                                </Link>
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>
            </div>
        </main>
    );
}

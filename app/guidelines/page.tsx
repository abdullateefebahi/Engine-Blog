import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Community Guidelines",
    description: "Read our community guidelines to understand how to interact with others on Engine Blog.",
    openGraph: {
        title: "Community Guidelines | Engine Blog",
        description: "Read our community guidelines to understand how to interact with others on Engine Blog.",
    }
};

export default function CommunityGuidelines() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Community Guidelines</span>
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-gray-100 dark:border-gray-700">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
                        Community <span className="text-blue-600">Guidelines</span>
                    </h1>

                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-10 text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        <p className="text-lg">
                            Our goal is to foster a professional and supportive community for the Engineering students of UNIBEN. Help us maintain this by following these simple rules.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                            <div className="p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
                                <div className="text-2xl mb-4">🤝</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Be Respectful</h3>
                                <p className="text-sm">Treat others with the same respect you expect. No hate speech, bullying, or harassment.</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800">
                                <div className="text-2xl mb-4">📚</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Be Academic</h3>
                                <p className="text-sm">Engage in constructive discussions. Avoid misinformation or spamming comment sections.</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800">
                                <div className="text-2xl mb-4">⚖️</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Stay Relevant</h3>
                                <p className="text-sm">Keep comments relevant to the post topic. Avoid excessive self-promotion or advertising.</p>
                            </div>

                            <div className="p-6 rounded-3xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800">
                                <div className="text-2xl mb-4">🛡️</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Think Safety</h3>
                                <p className="text-sm">Don&apos;t share private information about yourself or others (Doxing).</p>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reporting Violations</h2>
                            <p>
                                If you see content that violates these guidelines, please contact our moderation team via the feedback link or email. We take all reports seriously and will act accordingly to protect the community.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-400">
                            Last updated: December 22, 2025
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

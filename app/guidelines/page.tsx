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

                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-10 text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p className="text-lg font-medium">
                            Welcome to the UNIBEN Engine Blog community. These guidelines help us maintain a respectful, safe, and productive environment for all members of the Faculty of Engineering community.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                                <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
                                    <div className="text-2xl mb-3">🤝</div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Respect</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Treat all community members with dignity and courtesy, regardless of background or opinion.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800">
                                    <div className="text-2xl mb-3">📚</div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Academic Integrity</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Share accurate information and give proper credit to original sources.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800">
                                    <div className="text-2xl mb-3">💡</div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Constructive Dialogue</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Engage in meaningful discussions that add value to the community.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800">
                                    <div className="text-2xl mb-3">🛡️</div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Safety First</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Protect your privacy and respect the privacy of others.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Expected Behavior</h2>
                            <ul className="space-y-3 list-none pl-0">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 dark:text-green-400 text-xl shrink-0">✓</span>
                                    <span><strong>Be respectful and professional</strong> in all interactions, even when you disagree.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 dark:text-green-400 text-xl shrink-0">✓</span>
                                    <span><strong>Stay on topic</strong> and keep discussions relevant to the post or community.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 dark:text-green-400 text-xl shrink-0">✓</span>
                                    <span><strong>Cite your sources</strong> when sharing information, research, or quotes.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 dark:text-green-400 text-xl shrink-0">✓</span>
                                    <span><strong>Welcome newcomers</strong> and help create an inclusive environment.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 dark:text-green-400 text-xl shrink-0">✓</span>
                                    <span><strong>Report violations</strong> to help maintain community standards.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prohibited Content & Behavior</h2>
                            <p className="mb-4">The following actions are strictly prohibited and may result in immediate removal of content and/or account suspension:</p>

                            <div className="space-y-4">
                                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-900/10">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Harassment & Bullying</h3>
                                    <p className="text-sm">Targeted attacks, intimidation, threats, or persistent unwanted contact toward any individual or group.</p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-900/10">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Hate Speech & Discrimination</h3>
                                    <p className="text-sm">Content that promotes hatred, violence, or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or any other protected characteristic.</p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-900/10">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Misinformation & Academic Dishonesty</h3>
                                    <p className="text-sm">Deliberately spreading false information, plagiarism, or sharing exam questions/answers that violate academic integrity.</p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-900/10">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Spam & Self-Promotion</h3>
                                    <p className="text-sm">Excessive self-promotion, commercial advertising, or repetitive posting of irrelevant content.</p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-900/10">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Privacy Violations (Doxxing)</h3>
                                    <p className="text-sm">Sharing private or personal information about others without consent, including addresses, phone numbers, or private communications.</p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-900/10">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Illegal Content</h3>
                                    <p className="text-sm">Content that violates Nigerian law or promotes illegal activities.</p>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50 dark:bg-red-900/10">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Impersonation</h3>
                                    <p className="text-sm">Pretending to be another person, organization, or university official.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enforcement & Consequences</h2>
                            <p className="mb-4">Violations of these guidelines will be addressed according to the severity and frequency of the offense:</p>

                            <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">⚠️ First Violation (Minor)</h3>
                                    <p className="text-sm">Warning and content removal. Educational guidance on community standards.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">🚫 Second Violation or Moderate Offense</h3>
                                    <p className="text-sm">Temporary suspension (7-30 days) and content removal.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">❌ Severe or Repeated Violations</h3>
                                    <p className="text-sm">Permanent account suspension and reporting to university authorities if necessary.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reporting Violations</h2>
                            <p className="mb-4">If you encounter content or behavior that violates these guidelines:</p>
                            <ol className="space-y-2">
                                <li><strong>1. Use the Report Feature:</strong> Click the report button on the specific post or comment.</li>
                                <li><strong>2. Provide Details:</strong> Include specific information about the violation.</li>
                                <li><strong>3. Contact Moderators:</strong> For urgent matters, email us at <a href="mailto:engineblog.uniben@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">engineblog.uniben@gmail.com</a></li>
                            </ol>
                            <p className="mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <strong>Note:</strong> All reports are reviewed confidentially. False or malicious reports may result in consequences for the reporter.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Appeals Process</h2>
                            <p>If you believe your content was removed or your account was suspended in error, you may submit an appeal:</p>
                            <ul className="mt-3 space-y-2">
                                <li>• Email <a href="mailto:engineblog.uniben@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">engineblog.uniben@gmail.com</a> within 14 days of the action</li>
                                <li>• Include your username and a detailed explanation</li>
                                <li>• Appeals are typically reviewed within 5-7 business days</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to Guidelines</h2>
                            <p>We may update these guidelines periodically to reflect community needs and platform changes. Significant changes will be announced via blog posts and email notifications.</p>
                        </section>

                        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>Last updated:</strong> January 1, 2026<br />
                                <strong>Effective date:</strong> January 1, 2026
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                By using Engine Blog, you agree to abide by these Community Guidelines. Questions? Contact us at <a href="mailto:engineblog.uniben@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">engineblog.uniben@gmail.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

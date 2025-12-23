import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read our privacy policy to understand how we collect, use, and protect your data at Engine Blog.",
    openGraph: {
        title: "Privacy Policy | Engine Blog",
        description: "Read our privacy policy to understand how we collect, use, and protect your data at Engine Blog.",
    }
};

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Privacy Policy</span>
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-gray-100 dark:border-gray-700">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
                        Privacy <span className="text-blue-600">Policy</span>
                    </h1>

                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Protect Your Data</h2>
                            <p>
                                At UNIBEN Engine Blog, we take your privacy seriously. This policy explains what information we collect and how we use it.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Account Info:</strong> Email address, username, and profile metadata.</li>
                                <li><strong>Interactions:</strong> Your comments, reactions, and bookmarks.</li>
                                <li><strong>Log Data:</strong> IP addresses and browser types for security and analytics.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use of Information</h2>
                            <p>
                                Your data is used strictly for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Personalizing your experience.</li>
                                <li>Attributing your comments and activity.</li>
                                <li>Improving the technical performance of the platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
                            <p>
                                We use industry-standard encryption and secure cloud infrastructure (Supabase & Sanity) to protect your information. We never sell your personal data to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Third-Party Services</h2>
                            <p>
                                We utilize Google Authentication and Supabase for secure identity management. Their respective privacy policies also apply when using these features.
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

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read our terms of service to understand the rules and guidelines for using Engine Blog.",
    openGraph: {
        title: "Terms of Service | Engine Blog",
        description: "Read our terms of service to understand the rules and guidelines for using Engine Blog.",
    }
};

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-12 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Terms of Service</span>
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-gray-100 dark:border-gray-700">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
                        Terms of <span className="text-blue-600">Service</span>
                    </h1>

                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using the UNIBEN Engine Blog, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. User Accounts</h2>
                            <p>
                                To interact with features like comments and reactions, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Content</h2>
                            <p>
                                You retain ownership of any content you post (comments, profiles, etc.). However, by posting content, you grant the Engine Blog a non-exclusive, royalty-free, perpetual license to use, display, and distribute that content within the platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Prohibited Conduct</h2>
                            <p>
                                You agree not to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Post harassing, abusive, or discriminatory content.</li>
                                <li>Attempt to gain unauthorized access to our systems.</li>
                                <li>Use the platform for any illegal activities or spam.</li>
                                <li>Interfere with the normal functioning of the blog.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Modifications</h2>
                            <p>
                                We reserve the right to modify these terms at any time. Significant changes will be announced via our Official Notices section.
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

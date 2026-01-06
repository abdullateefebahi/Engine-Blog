export const dynamic = "force-static";
// Force re-save to resolve potential dev server caching issues

import { notFound } from "next/navigation";
import Image from "next/image";
import { getAuthorBySlug, getPostsByAuthor, getAllAuthors } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { Metadata } from "next";

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const author = await getAuthorBySlug(params.slug);

    if (!author) return { title: "Author Not Found" };

    return {
        title: `${author.name} | Engine Blog`,
        description: `Read articles published by ${author.name} on the UNIBEN Engine Blog.`,
    };
}

export async function generateStaticParams() {
    const authors = await getAllAuthors();
    return authors.map((author: any) => ({
        slug: author.slug,
    }));
}

export default async function AuthorPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const params = await props.params;
    const author = await getAuthorBySlug(params.slug);
    const posts = await getPostsByAuthor(params.slug);

    if (!author) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Author Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-12 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                        {author.image && (
                            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl flex-shrink-0">
                                <Image
                                    src={author.image}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}
                        <div className="flex-grow">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                                {author.name}
                            </h1>

                            {author.bio ? (
                                <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 bio-portable-text">
                                    <PortableTextRenderer value={author.bio} />
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 mb-6 italic">
                                    An engineering enthusiast contributing to the UNIBEN Engine Blog.
                                </p>
                            )}

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold block text-sm uppercase tracking-wider">Articles</span>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">{posts.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="space-y-12">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                            Latest Articles
                        </h2>
                    </div>

                    {posts.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {posts.map((post: any) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No articles published yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

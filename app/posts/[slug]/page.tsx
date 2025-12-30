export const dynamic = "force-static";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts, getPost } from "@/lib/posts";
import { remark } from "remark";
import html from "remark-html";
import Image from "next/image";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import ShareButtons from "@/components/ShareButtons";
import BookmarkButton from "@/components/BookmarkButton";
import CommentsSection from "@/components/Comments";
import Reactions from "@/components/Reactions";
import LightboxImage from "@/components/LightboxImage";
import AITools from "@/components/AITools";
import { portableTextToPlainText } from "@/lib/utils";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://engine-blog.vercel.app"; // Fallback URL

  return {
    title: post.title,
    description: post.excerpt || "Read more about this post on Engine Blog",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Read more about this post on Engine Blog",
      url: `${baseUrl}/posts/${post.slug}`,
      siteName: "Engine Blog",
      images: post.coverImage
        ? [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ]
        : [],
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Read more about this post on Engine Blog",
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Handle both local markdown (data.content) and Sanity (post.body) logic
  const content = post.body || "";
  const processed = typeof content === 'string'
    ? await remark().use(html).process(content)
    : { toString: () => "Portable Text content - requires @portabletext/react to render" };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900 shadow-sm border-x border-gray-100 dark:border-gray-800/50">
        {post.coverImage && (
          <LightboxImage
            src={post.coverImage}
            alt={post.title}
            className="mb-10 w-full h-[450px] rounded-[2rem] bg-transparent border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl"
            showBlurBackground={true}
          />
        )}

        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
            {post.title}
          </h1>
          <div className="shrink-0 pt-2">
            <BookmarkButton postSlug={post.slug} />
          </div>
        </div>



        <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {post.authorSlug ? (
              <Link href={`/authors/${post.authorSlug}`} className="flex items-center gap-3 group/author transition-all">
                {post.authorImage && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm transition-transform group-hover/author:scale-110 group-hover/author:shadow-md">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      width={40}
                      height={40}
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  {post.author && (
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-fit group-hover/author:bg-blue-50 dark:group-hover/author:bg-blue-900/30 group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors">
                      {post.author}
                    </span>
                  )}
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ) : (
              /* Fallback if no slug */
              <div className="flex items-center gap-3">
                {post.authorImage && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      width={40}
                      height={40}
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  {post.author && (
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 w-fit">
                      {post.author}
                    </span>
                  )}
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.categories?.map((cat: string) => (
              <span key={cat} className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full uppercase tracking-wider">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <AITools
          content={portableTextToPlainText(post.body)}
          showBanner={true}
          publishDate={post.publishedAt}
          authorName={post.author}
        />

        <div className="prose-container">
          <PortableTextRenderer value={post.body} />
        </div>

        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6">Share this article</h3>
          <ShareButtons url={`/posts/${post.slug}`} title={post.title} />
        </div>

        <div className="mt-12">
          <Reactions postSlug={post.slug} />
        </div>

        <CommentsSection postSlug={post.slug} />
      </article>
    </main>
  );
}

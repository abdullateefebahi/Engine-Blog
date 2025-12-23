export const dynamic = "force-static";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllPosts, getPost } from "@/lib/posts";
import { remark } from "remark";
import html from "remark-html";
import Image from "next/image";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/Comments";
import Reactions from "@/components/Reactions";

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
    <article className="max-w-3xl mx-auto px-4 py-12">
      {post.coverImage && (
        <div className="mb-8 relative w-full h-[400px] rounded-lg overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <p className="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <span className="text-gray-300">|</span>
        <div className="flex flex-wrap gap-2">
          {post.categories?.map((cat: string) => (
            <span key={cat} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {cat}
            </span>
          ))}
        </div>
      </div>

      <PortableTextRenderer value={post.body} />

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 mb-8">
        <ShareButtons url={`/posts/${post.slug}`} title={post.title} />
      </div>

      <Reactions postSlug={post.slug} />
      <CommentsSection postSlug={post.slug} />
    </article>
  );
}

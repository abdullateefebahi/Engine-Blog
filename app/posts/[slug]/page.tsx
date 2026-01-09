import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/posts";
import PostClient from "@/components/PostClient";

export const dynamic = "force-static";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://engineblog.live";

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

  const relatedPosts = await getRelatedPosts(post.slug, post.categories || []);

  return <PostClient post={post} relatedPosts={relatedPosts} />;
}

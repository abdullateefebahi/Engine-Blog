import Link from "next/link";
import Image from "next/image";
import ShareButtons from "./ShareButtons";
import InteractionsCount from "./InteractionsCount";
import QuickReactions from "./QuickReactions";

export default function PostCard({ post }: any) {
  const slug = typeof post.slug === 'string' ? post.slug : post.slug?.current || post.slug;
  const postUrl = `/posts/${slug}`;
  // ... (rest of imports/types)

  // Helper to get a plain text preview from Portable Text body if excerpt is missing
  const getExcerpt = () => {
    if (post.excerpt) return post.excerpt;
    if (!post.body || !Array.isArray(post.body)) return "";

    const block = post.body.find((b: any) => b._type === "block");
    if (block && block.children) {
      return block.children
        .filter((c: any) => c._type === "span")
        .map((c: any) => c.text)
        .join("")
        .substring(0, 160) + "...";
    }
    return "";
  };

  const excerpt = getExcerpt();

  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden h-full">
      {post.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="flex flex-col flex-grow p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
          {Array.isArray(post.categories) ? (
            post.categories.map((cat: string) => (
              <span key={cat} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {cat}
              </span>
            ))
          ) : post.category ? (
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {post.category}
            </span>
          ) : null}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {post.author && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-2" />
              By {post.author}
            </span>
          )}

          {/* Interaction Counts */}
          <div className="flex items-center">
            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-2" />
            <InteractionsCount postSlug={slug} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link href={postUrl}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed flex-grow">
          {excerpt}
        </p>

        <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4">
          <QuickReactions postSlug={slug} />
          <ShareButtons url={postUrl} title={post.title} />
        </div>

        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
          Read more
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

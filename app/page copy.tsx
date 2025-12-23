import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";
import { Category, PostMeta } from "@/lib/types";

const categories: Category[] = [
  "Engineering",
  "Campus News",
  "Academics",
  "Events",
  "Opportunities",
  "Student Life",
];

export default async function Home(props: {
  searchParams?: Promise<{ category?: Category }>;
}) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams?.category;
  const allPosts = getAllPosts();

  const posts = activeCategory
    ? allPosts.filter((post: any) => post.category === activeCategory)
    : allPosts;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            UNIBEN Engine Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Updates, news, and insights from the Faculty of Engineering.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <a
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!activeCategory
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
          >
            All
          </a>

          {categories.map((cat) => (
            <a
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no posts in the {activeCategory} category yet.
            </p>
            <a href="/" className="mt-6 inline-block text-blue-600 font-medium hover:underline">
              View all posts
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

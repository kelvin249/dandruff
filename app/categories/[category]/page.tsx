import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Post {
  slug: string;
  title: string;
  description: string;
  date?: string;
  category?: string;
}

async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const postsDir = path.join(process.cwd(), "content/posts");
  const files = fs.readdirSync(postsDir);

  const posts: Post[] = [];

  files
    .filter((file) => file.endsWith(".mdx"))
    .forEach((file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);

      const category = data.category || "Uncategorized";

      if (category.toLowerCase() === categorySlug.toLowerCase()) {
        posts.push({
          slug: file.replace(".mdx", ""),
          title: data.title || file.replace(".mdx", ""),
          description: data.description || "",
          date: data.date || "",
          category: category,
        });
      }
    });

  // Sort by date
  posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  return posts;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return {
    title: `${decodedCategory} Posts`,
    description: `All blog posts in the ${decodedCategory} category`,
    openGraph: {
      title: `${decodedCategory} Posts`,
      description: `All blog posts in the ${decodedCategory} category`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = await getPostsByCategory(decodedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/categories"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 inline-flex items-center gap-1"
        >
          ← Back to Categories
        </Link>

        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
          {decodedCategory}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-12">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in the{" "}
          <span className="font-semibold">{decodedCategory}</span> category
        </p>

        {posts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No posts found in this category.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="h-full p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
                  <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                    {post.title}
                  </h2>
                  {post.date && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <p className="text-zinc-600 dark:text-zinc-300 line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

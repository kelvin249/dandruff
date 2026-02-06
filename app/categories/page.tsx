import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all blog posts by categories",
  openGraph: {
    title: "Categories",
    description: "Browse all blog posts by categories",
    type: "website",
  },
};

interface Post {
  slug: string;
  title: string;
  description: string;
  date?: string;
  category?: string;
}

interface CategoriesData {
  [key: string]: Post[];
}

async function getAllPostsWithCategories(): Promise<CategoriesData> {
  const postsDir = path.join(process.cwd(), "content/posts");
  const files = fs.readdirSync(postsDir);

  const categoriesMap: CategoriesData = {};

  files
    .filter((file) => file.endsWith(".mdx"))
    .forEach((file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);

      const post: Post = {
        slug: file.replace(".mdx", ""),
        title: data.title || file.replace(".mdx", ""),
        description: data.description || "",
        date: data.date || "",
        category: data.category || "Uncategorized",
      };

      // Add post to category - use non-null assertion since category is always set above
      const category = post.category || "Uncategorized";
      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }
      categoriesMap[category].push(post);
    });

  // Sort posts within each category by date
  Object.keys(categoriesMap).forEach((category) => {
    categoriesMap[category].sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  });

  return categoriesMap;
}

export default async function CategoriesPage() {
  const categoriesData = await getAllPostsWithCategories();
  const sortedCategories = Object.keys(categoriesData).sort();

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
          Categories
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-12">
          Explore blog posts by category ({sortedCategories.length} categories)
        </p>

        {sortedCategories.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No categories found.</p>
        ) : (
          <div className="space-y-12">
            {sortedCategories.map((category) => (
              <div key={category} className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                  {category} ({categoriesData[category].length})
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {categoriesData[category].map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <div className="h-full p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                          {post.title}
                        </h3>
                        {post.date && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

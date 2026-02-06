import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse all blog posts by tags",
  openGraph: {
    title: "Tags",
    description: "Browse all blog posts by tags",
    type: "website",
  },
};

interface Post {
  slug: string;
  title: string;
  description: string;
  date?: string;
  tags?: string[];
}

interface TagsData {
  [key: string]: Post[];
}

async function getAllPostsWithTags(): Promise<TagsData> {
  const postsDir = path.join(process.cwd(), "content/posts");
  const files = fs.readdirSync(postsDir);

  const tagsMap: TagsData = {};

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
        tags: Array.isArray(data.tags) ? data.tags : [],
      };

      // Add post to each tag
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach((tag) => {
          const normalizedTag = String(tag).trim().toLowerCase();
          if (!tagsMap[normalizedTag]) {
            tagsMap[normalizedTag] = [];
          }
          tagsMap[normalizedTag].push(post);
        });
      }
    });

  // Sort posts within each tag by date
  Object.keys(tagsMap).forEach((tag) => {
    tagsMap[tag].sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  });

  return tagsMap;
}

export default async function TagsPage() {
  const tagsData = await getAllPostsWithTags();
  const sortedTags = Object.keys(tagsData).sort();

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
          Tags
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-12">
          Explore blog posts by topic ({sortedTags.length} tags)
        </p>

        {sortedTags.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No tags found.</p>
        ) : (
          <div className="space-y-12">
            {sortedTags.map((tag) => (
              <div key={tag} className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6 capitalize">
                  {tag} ({tagsData[tag].length})
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {tagsData[tag].map((post) => (
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

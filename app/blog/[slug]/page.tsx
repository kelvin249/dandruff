import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { TableOfContents, extractHeadings } from "@/components/TableOfContents";
import { components } from "@/components/MdxComponents";
import PrevNextLinks from "@/components/PrevNextLinks";

interface PostParams {
  slug: string;
}

interface PostData {
  title: string;
  description: string;
  date?: string;
  image?: string;
  tags?: string[];
}

async function getPost(slug: string) {
  const postsDir = path.join(process.cwd(), "content/posts");
  const filePath = path.join(postsDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const { data, content: mdxContent } = matter(content);

  return {
    data: data as PostData,
    content: mdxContent,
  };
}

async function getAllPosts() {
  const postsDir = path.join(process.cwd(), "content/posts");
  const files = fs.readdirSync(postsDir);

  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const { data } = matter(content);
      return {
        slug,
        title: (data as PostData).title || slug,
      };
    });

  return posts;
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "content/posts");
  const files = fs.readdirSync(postsDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(".mdx", ""),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PostParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.data.title,
    description: post.data.description,
    alternates: {
        canonical: `https://acme.com/blog/${slug}`,
      },
    openGraph: {
      title: post.data.title,
      description: post.data.description,
      type: "article",
      images: post.data.image ? [post.data.image] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<PostParams> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
            Post not found
          </h1>
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const headings = extractHeadings(post.content);
  
  // Get previous and next links
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const previousItem = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;
  const nextItem = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;

  return (
    <article className="min-h-screen bg-white dark:bg-black">
      {/* Hero Image */}
      {post.data.image && (
        <div className="relative w-full h-96 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <img
            src={post.data.image}
            alt={post.data.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar - Table of Contents */}
          {headings.length > 0 && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className={headings.length > 0 ? "lg:col-span-3" : ""}>
            {/* Header */}
            <div className="mb-8">
              <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
                ← Back to blog
              </Link>

              <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                {post.data.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                
                {post.data.date && (
                  <time className="text-zinc-600 dark:text-zinc-400">
                    {new Date(post.data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
              </div>

              {post.data.description && (
                <p className="text-lg text-zinc-600 dark:text-zinc-300 mt-4">
                  {post.data.description}
                </p>                
              )}

            </div>

            {/* Table of Contents - Mobile Only */}
            <div className="lg:hidden mb-8">
              <TableOfContents headings={headings} />
            </div>

            {/* MDX Content */}
            <div>
              <MDXRemote source={post.content} components={components} />
            </div>

            {/* Previous/Next Links */}
            <PrevNextLinks previousItem={previousItem} nextItem={nextItem} />
          </div>
        </div>
      </div>
    </article>
  );
}

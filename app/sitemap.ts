import { MetadataRoute } from "next";
import { getPosts } from "@/app/blog/page";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export const baseUrl = "https://acme.com";
const POSTS_DIR = path.join(process.cwd(), "content/posts");

/**
 * Get last modified date from git.
 * Falls back to filesystem mtime if git is unavailable (e.g. CI edge cases).
 */
function getGitLastModified(filePath: string): Date {
  try {
    const isoDate = execSync(
      `git log -1 --format=%cI -- "${filePath}"`,
      { stdio: ["ignore", "pipe", "ignore"] }
    )
      .toString()
      .trim();

    return isoDate ? new Date(isoDate) : fs.statSync(filePath).mtime;
  } catch {
    return fs.statSync(filePath).mtime;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  /**
   * ─────────────────────────────
   * Static pages
   * ─────────────────────────────
   */
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  /**
   * ─────────────────────────────
   * Blog posts (exclude drafts)
   * ─────────────────────────────
   */
  const publishedPosts = posts.filter((post) => !post.draft);

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => {
    const postFile = path.join(POSTS_DIR, `${post.slug}.mdx`);

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: getGitLastModified(postFile),
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  /**
   * ─────────────────────────────
   * Tag / category pages
   * ─────────────────────────────
   */
  const tagSet = new Set<string>();

  publishedPosts.forEach((post) => {
    post.tags?.forEach((tag: string) => tagSet.add(tag));
  });

  const tagRoutes: MetadataRoute.Sitemap = Array.from(tagSet).map((tag) => ({
    url: `${baseUrl}/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}

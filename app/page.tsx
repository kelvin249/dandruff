import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DanDruff",
  description: "A modern blog built with Next.js and MDX",
  alternates: {
        canonical: "https://acme.com",
      },
  openGraph: {
    title: "DanDruff",
    description: "A modern blog built with Next.js and MDX",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-6">
            DanDruff
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Welcome to my blog. Explore my latest posts on web development, technology, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Read Blog Posts
            </Link>
            <Link
              href="/about"
              className="inline-block px-8 py-3 border border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors font-semibold"
            >
              Learn About Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

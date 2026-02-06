import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about me",
  openGraph: {
    title: "About",
    description: "Learn more about me",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
          About Me
        </h1>
        <div className="prose prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <p className="text-lg mb-6">
            Welcome to my blog! I'm passionate about web development and technology.
          </p>
          <p className="text-lg mb-6">
            This blog is built with Next.js, MDX, and Tailwind CSS to showcase my thoughts and projects.
          </p>
          <p className="text-lg">
            Feel free to explore my blog posts and get in touch if you'd like to connect!
          </p>
        </div>
      </div>
    </div>
  );
}
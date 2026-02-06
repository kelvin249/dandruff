import React from "react";

export interface Heading {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 lg:bg-transparent lg:border-0 lg:p-0">
      <h3 className="text-sm font-semibold text-black dark:text-white mb-3">
        Table of Contents
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}>
            <a
              href={`#${heading.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline break-words"
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Extract headings from MDX content
 * Looks for markdown heading syntax (##, ###, etc.)
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    // Create URL-friendly ID from title
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    headings.push({ id, title, level });
  }

  return headings;
}

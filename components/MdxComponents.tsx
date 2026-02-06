import React from "react";

/**
 * Convert text to a URL-friendly ID
 */
function generateId(text: React.ReactNode): string {
  const plainText = extractText(text);
  return plainText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Extract plain text from React children
 */
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }
  if (React.isValidElement(children)) {
    const element = children as React.ReactElement<any>;
    return extractText(element.props.children);
  }
  return "";
}

interface HeadingProps {
  children: React.ReactNode;
}

export const components = {
  h1: ({ children }: HeadingProps) => {
    const id = generateId(children);
    return (
      <h1 id={id} className="text-4xl font-bold text-black dark:text-white mt-8 mb-4 scroll-mt-20">
        {children}
      </h1>
    );
  },
  h2: ({ children }: HeadingProps) => {
    const id = generateId(children);
    return (
      <h2 id={id} className="text-3xl font-bold text-black dark:text-white mt-8 mb-4 scroll-mt-20">
        {children}
      </h2>
    );
  },
  h3: ({ children }: HeadingProps) => {
    const id = generateId(children);
    return (
      <h3 id={id} className="text-2xl font-semibold text-black dark:text-white mt-6 mb-3 scroll-mt-20">
        {children}
      </h3>
    );
  },
  h4: ({ children }: HeadingProps) => {
    const id = generateId(children);
    return (
      <h4 id={id} className="text-xl font-semibold text-black dark:text-white mt-6 mb-3 scroll-mt-20">
        {children}
      </h4>
    );
  },
  h5: ({ children }: HeadingProps) => {
    const id = generateId(children);
    return (
      <h5 id={id} className="text-lg font-semibold text-black dark:text-white mt-4 mb-2 scroll-mt-20">
        {children}
      </h5>
    );
  },
  h6: ({ children }: HeadingProps) => {
    const id = generateId(children);
    return (
      <h6 id={id} className="text-base font-semibold text-black dark:text-white mt-4 mb-2 scroll-mt-20">
        {children}
      </h6>
    );
  },
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target={href?.startsWith("/") ? undefined : "_blank"}
      rel={href?.startsWith("/") ? undefined : "noopener noreferrer"}
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 mb-4 space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside text-zinc-700 dark:text-zinc-300 mb-4 space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-zinc-700 dark:text-zinc-300">{children}</li>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded text-sm font-mono text-zinc-800 dark:text-zinc-200">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 py-2 text-zinc-600 dark:text-zinc-400 italic mb-4">
      {children}
    </blockquote>
  ),
};

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zm.464-4.536l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm-2.828-2.828l.707-.707a1 1 0 01-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 16a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-4-9a1 1 0 10-2 0 1 1 0 002 0zm12 0a1 1 0 10-2 0 1 1 0 002 0zM2.458 18.457a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zM18 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeSwitcher from './ThemeSwitcher';
import { MobileMenu } from './MobileMenu';
import { Button } from "@/components/ui/button"
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home Link */}
          <Link
            href="/"
            className="text-xl font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            DanDruff
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors ${pathname === "/"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              <Button className="inline-block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"> Home </Button>
            </Link>
            <Link
              href="/blog"
              className={`transition-colors ${pathname.startsWith("/blog")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              <Button className="inline-block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"> Blog </Button>
            </Link>
            <Link
              href="/tags"
              className={`transition-colors ${pathname.startsWith("/tags")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              <Button className="inline-block px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-yellow-950 transition-colors font-semibold"> Tags </Button>
            </Link>
            <Link
              href="/categories"
              className={`transition-colors ${pathname.startsWith("/categories")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              <Button className="inline-block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"> Categories </Button>
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${pathname === "/about"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              <Button className="inline-block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"> About </Button>
            </Link>

            {/* Theme Toggle */}
            <ThemeSwitcher />
          </nav>

          {/* Mobile Menu and Theme Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeSwitcher />
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </div>
      <SearchBar />
    </header>
  );
}

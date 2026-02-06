// Mobile navigation menu component - renders responsive hamburger menu for mobile devices
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Props for the MobileMenu component
interface MobileMenuProps {
  pathname: string;
}

export function MobileMenu({ pathname }: MobileMenuProps) {
  // State to track if the mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu visibility between open and closed states
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the mobile menu
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Navigation menu items with their routes and labels
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/tags", label: "Tags" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
  ];

  // Determine if a menu item's route matches the current pathname
  // Special handling for home route to avoid false positives with other routes
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Hamburger toggle button - only visible on mobile (md: breakpoint) */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {/* SVG icon that transforms between hamburger (☰) and close (✕) icon based on menu state */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Mobile menu dropdown - only rendered when isOpen is true */}
      {isOpen && (
        <>
          {/* Semi-transparent backdrop that closes menu when clicked */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
          />

          {/* Menu navigation panel - slides down from top, visible only on mobile */}
          <nav className="fixed top-16 left-0 right-0 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 z-50 md:hidden shadow-lg">
            <div className="flex flex-col">
              {/* Render each menu item as a clickable link */}
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 transition-colors ${
                    isActive(item.href)
                      ? "text-blue-600 dark:text-blue-400 bg-zinc-50 dark:bg-zinc-900"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  );
}

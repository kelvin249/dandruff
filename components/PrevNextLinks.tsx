import Link from "next/link";

interface NavItem {
  slug: string;
  title: string;
}

interface PrevNextLinksProps {
  previousItem?: NavItem;
  nextItem?: NavItem;
  basePath?: string;
}

export default function PrevNextLinks({
  previousItem,
  nextItem,
  basePath = "/blog",
}: PrevNextLinksProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      {previousItem ? (
        <Link
          href={`${basePath}/${previousItem.slug}`}
          className="group flex flex-col items-start gap-2 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
        >
          <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            ← Previous
          </span>
          <span className="font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {previousItem.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextItem ? (
        <Link
          href={`${basePath}/${nextItem.slug}`}
          className="group flex flex-col items-end gap-2 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-right"
        >
          <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Next →
          </span>
          <span className="font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {nextItem.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

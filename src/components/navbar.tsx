import Link from "next/link";
import Image from "next/image";
import type { JSX } from "react";

export default function Navbar(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/15 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={80}
            height={18}
            priority
          />
          <span className="hidden sm:inline">Prisma Demo</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="opacity-80 hover:opacity-100">
            Home
          </Link>
          <a
            href="/api/posts"
            className="opacity-80 hover:opacity-100"
            title="Raw posts API"
          >
            API
          </a>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100"
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}

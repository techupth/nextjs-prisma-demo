import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Post = {
  id: number;
  title: string;
  content?: string | null;
  published: boolean;
  createdAt: string;
  category?: { id: number; name: string } | null;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from the API
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
        const data = await res.json();
        if (isMounted) setPosts(data);
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : "Failed to load posts";
        if (isMounted) setError(errorMessage);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const chip = (label: string) => (
    <span className="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/20">
      {label}
    </span>
  );

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <main className="flex w-full max-w-5xl flex-col gap-6 row-start-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={28}
            />
            <h1 className="text-xl font-semibold">Posts</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {chip("Next.js")}
            {chip("Prisma")}
          </div>
        </div>

        {loading && <p className="text-sm opacity-70">Loading posts…</p>}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {/* Display posts if available */}
        {!loading && !error && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="block rounded-lg border border-black/[.08] dark:border-white/[.145] p-4 hover:shadow-sm transition-shadow bg-white/60 dark:bg-black/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    {post.published ? chip("Published") : chip("Draft")}
                  </div>
                  <p className="mt-2 text-sm text-black/70 dark:text-white/70 line-clamp-3">
                    {post.content || "No content"}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    {post.category && chip(post.category.name)}
                    <span className="opacity-60">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

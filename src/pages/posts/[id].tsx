import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

type Post = {
  id: number;
  title: string;
  content?: string | null;
  published: boolean;
  createdAt: string;
  category?: { id: number; name: string } | null;
};

export default function PostPage() {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const idParam = router.query.id;
    const id = Array.isArray(idParam)
      ? parseInt(idParam[0] as string, 10)
      : parseInt(String(idParam), 10);

    if (!id || Number.isNaN(id)) {
      setError("Invalid post id");
      setLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.status === 404) throw new Error("Post not found");
        if (!res.ok) throw new Error(`Failed to load post (${res.status})`);
        const data: Post = await res.json();
        if (alive) setPost(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load post";
        if (alive) setError(message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router.isReady, router.query.id]);

  const chip = (label: string) => (
    <span className="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/20">
      {label}
    </span>
  );

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <Head>
        <title>{post ? `${post.title} • Post` : "Post"}</title>
      </Head>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-semibold leading-tight">
            {post ? post.title : loading ? "Loading…" : "Post"}
          </h1>
          <div className="flex items-center gap-2 text-xs">
            {post && (post.published ? chip("Published") : chip("Draft"))}
            {post?.category && chip(post.category.name)}
          </div>
        </div>

        {loading && <p className="text-sm opacity-70">Loading post…</p>}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {!loading && !error && post && (
          <>
            <p className="text-sm opacity-60 mb-4">
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <article className="prose dark:prose-invert max-w-none">
              {post.content ?? "No content"}
            </article>
          </>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}


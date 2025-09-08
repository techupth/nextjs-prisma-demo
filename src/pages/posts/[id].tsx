import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import prisma from "@/lib/prisma";

type PostPageProps = {
  post: {
    id: number;
    title: string;
    content: string | null;
    published: boolean;
    createdAt: string;
    category: { id: number; name: string } | null;
  };
};

export default function PostPage({ post }: PostPageProps) {
  return (
    <div className="min-h-screen p-6 sm:p-10">
      <Head>
        <title>{post.title} • Post</title>
      </Head>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-semibold leading-tight">{post.title}</h1>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full border border-black/10 dark:border-white/20">
              {post.published ? "Published" : "Draft"}
            </span>
            {post.category && (
              <span className="px-2 py-0.5 rounded-full border border-black/10 dark:border-white/20">
                {post.category.name}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm opacity-60 mb-4">
          {new Date(post.createdAt).toLocaleString()}
        </p>

        <article className="prose dark:prose-invert max-w-none">
          {post.content ?? "No content"}
        </article>

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

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (
  ctx,
) => {
  const idParam = ctx.params?.id;
  const id = Array.isArray(idParam) ? parseInt(idParam[0], 10) : parseInt(`${idParam}`, 10);

  if (!id || Number.isNaN(id)) {
    return { notFound: true };
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post: {
        id: post.id,
        title: post.title,
        content: post.content ?? null,
        published: post.published,
        createdAt: post.createdAt.toISOString(),
        category: post.category
          ? { id: post.category.id, name: post.category.name }
          : null,
      },
    },
  };
};


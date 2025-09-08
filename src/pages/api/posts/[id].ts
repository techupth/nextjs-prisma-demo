import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const postId = Array.isArray(id) ? id[0] : id;
  const parsedId = parseInt(postId || "", 10);

  if (!parsedId || Number.isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  if (req.method === "GET") {
    try {
      const post = await prisma.post.findUnique({
        where: { id: parsedId },
        include: { category: true },
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(200).json(post);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Server error";
      return res.status(500).json({ error: errorMessage });
    }
  }

  if (req.method === "PUT") {
    try {
      const { title, content, published, categoryId } = req.body || {};
      const post = await prisma.post.update({
        where: { id: parsedId },
        data: {
          title,
          content,
          published,
          categoryId: categoryId ? parseInt(String(categoryId), 10) : null,
        },
      });
      return res.status(200).json(post);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        if ((error as { code?: string }).code === "P2025") {
          return res.status(404).json({ error: "Post not found" });
        }
        if ((error as { code?: string }).code === "P2003") {
          return res.status(400).json({ error: "Category not found" });
        }
      }
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Server error";
      return res.status(500).json({ error: errorMessage });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.post.delete({ where: { id: parsedId } });
      return res.status(204).end();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2025"
      ) {
        return res.status(404).json({ error: "Post not found" });
      }
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Server error";
      return res.status(500).json({ error: errorMessage });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end("Method Not Allowed");
}

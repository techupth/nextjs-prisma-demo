import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { title, content, published, categoryId } = req.body || {};

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          published: Boolean(published) || false,
          categoryId: categoryId ? parseInt(String(categoryId), 10) : null,
        },
      });

      return res.status(201).json(post);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2003"
      ) {
        return res.status(400).json({ error: "Category not found" });
      }
      return res
        .status(500)
        .json({
          error:
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message
              : "Server error",
        });
    }
  }

  if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({ include: { category: true } });
      return res.status(200).json(posts);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Server error";
      return res.status(500).json({ error: errorMessage });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end("Method Not Allowed");
}

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, description } = req.body || {};

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const category = await prisma.category.create({
        data: { name, description },
      });

      return res.status(201).json(category);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        return res
          .status(400)
          .json({ error: "Category with this name already exists" });
      }
      return res.status(500).json({
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Server error",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: { select: { posts: true } },
        },
      });
      return res.status(200).json(categories);
    } catch (error: unknown) {
      return res.status(500).json({
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Server error",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end("Method Not Allowed");
}

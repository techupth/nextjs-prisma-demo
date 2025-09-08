import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const categoryId = Array.isArray(id) ? id[0] : id;
  const parsedId = parseInt(categoryId || "", 10);

  if (!parsedId || Number.isNaN(parsedId)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  if (req.method === "GET") {
    try {
      const category = await prisma.category.findUnique({
        where: { id: parsedId },
        include: { posts: true },
      });

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.status(200).json(category);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Server error";
      return res.status(500).json({ error: errorMessage || "Server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { name, description } = req.body || {};
      const category = await prisma.category.update({
        where: { id: parsedId },
        data: { name, description },
      });
      return res.status(200).json(category);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2025"
      ) {
        return res.status(404).json({ error: "Category not found" });
      }
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
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Server error";
      return res.status(500).json({ error: errorMessage || "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.category.delete({ where: { id: parsedId } });
      return res.status(204).end();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2025"
      ) {
        return res.status(404).json({ error: "Category not found" });
      }
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : "Server error";
      return res.status(500).json({ error: errorMessage || "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end("Method Not Allowed");
}

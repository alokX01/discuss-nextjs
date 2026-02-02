import type { Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PostWithData = Post & {
  topic: { slug: string };
  _count: { comments: number };
  user: { name: string | null };
};

export const fetchPostByTopicSlug = async (slug: string): Promise<PostWithData[]> => {
  return prisma.post.findMany({
    where: {
      topic: { slug },
    },
    include: {
      topic: { select: { slug: true } },
      _count: { select: { comments: true } },
      user: { select: { name: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const fetchTopPosts = async (): Promise<PostWithData[]> => {
  const posts = await prisma.post.findMany({
    include: {
      topic: { select: { slug: true } },
      _count: { select: { comments: true } },
      user: { select: { name: true } },
    },
  });

  const sortedPosts = posts.sort((a, b) => {
    const commentDiff = b._count.comments - a._count.comments;
    if (commentDiff !== 0) return commentDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sortedPosts.slice(0, 5);
};

export const fetchPostBySearch = async (term: string): Promise<PostWithData[]> => {
  return prisma.post.findMany({
    include: {
      topic: { select: { slug: true } },
      _count: { select: { comments: true } },
      user: { select: { name: true } },
    },
    where: {
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { content: { contains: term, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
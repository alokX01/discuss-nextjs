"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deletePost = async (postId: string, slug: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    throw new Error("You must be logged in");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== session.user.id) {
    throw new Error("You can only delete your own posts");
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete: ${error.message}`);
    } else {
      throw new Error("Failed to delete post");
    }
  }

  revalidatePath(`/topic/${slug}`);
  redirect(`/topic/${slug}`);
};
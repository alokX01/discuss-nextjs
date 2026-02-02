"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteComment = async (commentId: string, postId: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    throw new Error("You must be logged in");
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      userId: true,
      post: {
        select: {
          id: true,
          topic: {
            select: { slug: true },
          },
        },
      },
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== session.user.id) {
    throw new Error("You can only delete your own comments");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath(`/topic/${comment.post.topic.slug}/posts/${postId}`);
};
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const editCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be less than 2000 characters"),
});

type EditCommentState = {
  errors: {
    content?: string[];
    formError?: string[];
  };
};

export const editComment = async (
  commentId: string,
  postId: string,
  prevState: EditCommentState,
  formData: FormData
): Promise<EditCommentState> => {
  const result = editCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return {
      errors: {
        formError: ["You must be logged in"],
      },
    };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      userId: true,
      post: {
        select: {
          topic: {
            select: { slug: true },
          },
        },
      },
    },
  });

  if (!comment) {
    return {
      errors: {
        formError: ["Comment not found"],
      },
    };
  }

  if (comment.userId !== session.user.id) {
    return {
      errors: {
        formError: ["You can only edit your own comments"],
      },
    };
  }

  try {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: result.data.content,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          formError: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formError: ["Failed to update comment"],
        },
      };
    }
  }

  revalidatePath(`/topic/${comment.post.topic.slug}/posts/${postId}`);

  return {
    errors: {},
  };
};
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be less than 2000 characters"),
});

type CreateCommentState = {
  errors: {
    content?: string[];
    formError?: string[];
  };
};

export const createComment = async (
  { postId, parentId }: { postId: string; parentId?: string },
  prevState: CreateCommentState,
  formData: FormData
): Promise<CreateCommentState> => {
  const result = createCommentSchema.safeParse({
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

  try {
    await prisma.comment.create({
      data: {
        content: result.data.content,
        postId: postId,
        userId: session.user.id,
        parentId: parentId,
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
          formError: ["Failed to create comment"],
        },
      };
    }
  }

  const topic = await prisma.topic.findFirst({
    where: { posts: { some: { id: postId } } },
  });

  if (!topic) {
    return {
      errors: {
        formError: ["Failed to revalidate"],
      },
    };
  }

  revalidatePath(`/topic/${topic.slug}/posts/${postId}`);

  return {
    errors: {},
  };
};
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const editPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

type EditPostFormState = {
  errors: {
    title?: string[];
    content?: string[];
    formError?: string[];
  };
};

export const editPost = async (
  postId: string,
  slug: string,
  prevState: EditPostFormState,
  formData: FormData
): Promise<EditPostFormState> => {
  const result = editPostSchema.safeParse({
    title: formData.get("title"),
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

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      userId: true,
      topic: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!post) {
    return {
      errors: {
        formError: ["Post not found"],
      },
    };
  }

  if (post.userId !== session.user.id) {
    return {
      errors: {
        formError: ["You can only edit your own posts"],
      },
    };
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title: result.data.title,
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
          formError: ["Failed to update post"],
        },
      };
    }
  }

  revalidatePath(`/topic/${slug}/posts/${postId}`);
  redirect(`/topic/${slug}/posts/${postId}`);
};
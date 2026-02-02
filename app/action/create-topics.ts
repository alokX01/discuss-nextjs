"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topic } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3, "Topic name must be at least 3 characters")
    .max(30, "Topic name must be less than 30 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Only letters, numbers, spaces and hyphens allowed")
    .transform(val => val.toLowerCase().replace(/\s+/g, '-')),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

type CreateTopicFormState = {
  errors: {
    name?: string[];
    description?: string[];
    formError?: string[];
  };
};

export const createTopics = async (
  prevState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> => {
  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
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

  let topic: Topic;

  try {
    topic = await prisma.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          formError: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formError: ["Failed to create topic"],
        },
      };
    }
  }

  revalidatePath("/");
  redirect(`/topic/${topic.slug}`);
};
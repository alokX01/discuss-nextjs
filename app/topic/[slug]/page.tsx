import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PostList from "@/components/posts/post-list";
import PostCreateForm from "@/components/posts/post-create-form";
import { fetchPostByTopicSlug } from "@/lib/query/post";

type TopicShowPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TopicShowPage({ params }: TopicShowPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const { slug } = await params;

  const topic = await prisma.topic.findUnique({
    where: { slug },
  });

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-600">Topic not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-lg border bg-white p-6 mb-6">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          #{slug}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="mt-2 text-gray-600">{topic.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold">All Posts</h2>
          <PostList fetchData={() => fetchPostByTopicSlug(slug)} />
        </div>

        <div>
          <div className="rounded-lg border bg-white p-4 sticky top-20">
            <h3 className="font-semibold mb-3">Create New Post</h3>
            <PostCreateForm slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
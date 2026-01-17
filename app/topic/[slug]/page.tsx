import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { prisma } from "@/lib";
import PostList from "@/components/posts/post-list";
import PostCreateForm from "@/components/posts/post-create-form";
import { fetchPostByTopicSlug } from "@/lib/query/post";

/**
 * Page props
 * slug comes from URL: /topic/[slug]
 */
type TopicShowPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * TopicShowPage (Server Component)
 *
 * Responsibility:
 * - Show topic details
 * - Show all posts under that topic
 * - Allow creating new posts
 */
const TopicShowPage = async ({ params }: TopicShowPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
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
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ================= TOPIC HEADER ================= */}
      <header className="rounded-lg border bg-white p-6">
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          #{slug}
        </span>

        <h1 className="mt-3 text-3xl font-bold text-gray-900 capitalize">
          {slug}
        </h1>

        <p className="mt-2 max-w-3xl text-gray-600">
          {topic.description}
        </p>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* POSTS LIST */}
        <section className="lg:col-span-3 space-y-4">
          <PostList fetchData={() => fetchPostByTopicSlug(slug)} />
        </section>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <PostCreateForm slug={slug} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TopicShowPage;

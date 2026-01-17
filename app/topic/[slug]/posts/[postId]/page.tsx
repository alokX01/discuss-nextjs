// app/topic/[slug]/posts/[postId]/page.tsx

import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import PostShow from "@/components/posts/post-show";
import CommentCreateForm from "@/components/comments/comment-create-form";
import CommentList from "@/components/comments/comment-list";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

/**
 * Route params type
 * In App Router, params is async in newer versions
 */
type PostShowPageProps = {
  params: Promise<{
    slug: string;
    postId: string;
  }>;
};

/**
 * PostShowPage (Server Component)
 *
 * Responsibility:
 * - Auth check
 * - Show single post
 * - Show comments & reply system
 *
 * URL:
 * /topic/[slug]/posts/[postId]
 */
const PostShowPage = async ({ params }: PostShowPageProps) => {
  // Ensure user is authenticated
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/");
  }

  const { slug, postId } = await params;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back navigation */}
      <div>
        <Link href={`/topic/${slug}`}>
          <Button
            variant="ghost"
            className="pl-0 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to {slug}
          </Button>
        </Link>
      </div>

      {/* Post content */}
      <Suspense
        fallback={
          <div className="rounded-lg border bg-white p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-7 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
          </div>
        }
      >
        <PostShow postId={postId} />
      </Suspense>

      {/* Add comment */}
      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Join the discussion
        </h2>

        <CommentCreateForm postId={postId} startOpen />
      </section>

      {/* Comments list */}
      <section className="space-y-4">
        <CommentList postId={postId} />
      </section>
    </div>
  );
};

export default PostShowPage;

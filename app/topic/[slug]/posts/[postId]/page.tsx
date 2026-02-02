import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PostShow from "@/components/posts/post-show";
import CommentCreateForm from "@/components/comments/comment-create-form";
import CommentList from "@/components/comments/comment-list";
import { ChevronLeft } from "lucide-react";

type Props = {
  params: Promise<{
    slug: string;
    postId: string;
  }>;
};

const PostShowPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const { slug, postId } = await params;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      
      <Link href={`/topic/${slug}`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
        <ChevronLeft className="h-4 w-4" />
        Back to {slug}
      </Link>

      <Suspense fallback={<div className="bg-white rounded-lg border p-6 animate-pulse h-64" />}>
        <PostShow postId={postId} />
      </Suspense>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-semibold mb-4">Comments</h2>
        <CommentCreateForm postId={postId} />
      </div>

      <Suspense fallback={<div className="text-gray-500">Loading comments...</div>}>
        <CommentList postId={postId} />
      </Suspense>
    </div>
  );
};

export default PostShowPage;
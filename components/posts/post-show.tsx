// Prisma client for DB access
import { prisma } from "@/lib";

// Server-side auth (no client JS)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Owner-only actions
import PostEditForm from "./post-edit-form";
import PostDeleteButton from "./post-delete-button";

/**
 * Props:
 * postId comes from dynamic route
 */
type PostShowProps = {
  postId: string;
};

/**
 * PostShow (Server Component)
 *
 * Responsibility:
 * - Fetch a single post
 * - Display post details clearly
 * - Allow edit/delete only for owner
 */
const PostShow = async ({ postId }: PostShowProps) => {
  const session = await getServerSession(authOptions);

  // Fetch post with author + topic
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: { name: true },
      },
      topic: {
        select: { slug: true },
      },
    },
  });

  // Post not found
  if (!post) {
    return (
      <div className="rounded border bg-white p-6 text-center text-gray-600">
        Post not found
      </div>
    );
  }

  // Owner check
  const isOwner = session?.user?.id === post.userId;

  // Format date
  const createdAt = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="rounded border bg-white p-6">
      {/* ===== HEADER ===== */}
      <header className="mb-6 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {post.title}
          </h1>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-2">
              <PostEditForm
                postId={post.id}
                slug={post.topic.slug}
                title={post.title}
                content={post.content}
              />
              <PostDeleteButton
                postId={post.id}
                slug={post.topic.slug}
              />
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="text-sm text-gray-500">
          Posted by{" "}
          <span className="font-medium text-gray-700">
            {post.user.name || "Anonymous"}
          </span>{" "}
          on {createdAt}
        </div>
      </header>

      {/* ===== TOPIC ===== */}
      <div className="mb-6">
        <span className="inline-block rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {post.topic.slug}
        </span>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
        {post.content}
      </div>
    </article>
  );
};

export default PostShow;

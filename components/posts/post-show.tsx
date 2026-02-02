import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PostMenu from "./post-menu";

type PostShowProps = {
  postId: string;
};

const PostShow = async ({ postId }: PostShowProps) => {
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: { select: { name: true, image: true } },
      topic: { select: { slug: true } },
    },
  });

  if (!post) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
        Post not found
      </div>
    );
  }

  const isOwner = session?.user?.id === post.userId;

  return (
    <article className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {post.user.image && (
            <img src={post.user.image} alt="" className="w-10 h-10 rounded-full" />
          )}
          <div>
            <p className="font-medium text-gray-900">{post.user.name || "Anonymous"}</p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <PostMenu
            postId={post.id}
            slug={post.topic.slug}
            title={post.title}
            content={post.content}
          />
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>

      <span className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded mb-4">
        #{post.topic.slug}
      </span>

      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>
    </article>
  );
};

export default PostShow;
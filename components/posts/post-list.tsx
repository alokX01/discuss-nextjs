// React import for JSX types
import React from "react";

// UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Post type
import { PostWithData } from "@/lib/query/post";

// Next.js Link
import Link from "next/link";

/**
 * Props:
 * fetchData returns list of posts
 */
type PostListProps = {
  fetchData: () => Promise<PostWithData[]>;
};

/**
 * PostList (Server Component)
 *
 * Displays posts in a clean, readable list
 */
const PostList = async ({ fetchData }: PostListProps) => {
  const posts = await fetchData();

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="rounded border bg-white p-8 text-center text-gray-500">
        No discussions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/topic/${post.topic.slug}/posts/${post.id}`}
          className="block"
        >
          <Card className="border bg-white hover:bg-gray-50">
            <CardHeader className="space-y-1">
              {/* Title */}
              <CardTitle className="text-base font-medium text-gray-900">
                {post.title}
              </CardTitle>

              {/* Meta */}
              <CardDescription className="flex justify-between text-xs text-gray-500">
                <span>
                  {post.user.name || "Anonymous"}
                </span>
                <span>
                  {post._count.comments}{" "}
                  {post._count.comments === 1
                    ? "comment"
                    : "comments"}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default PostList;

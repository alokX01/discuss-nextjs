// React import (needed for typing + JSX support) ⚛️
import React from "react";

// Single comment renderer (handles replies recursively) 💬
import CommentShow from "./comment-show";

// DB query to fetch all comments of a post 📦
import { fetchCommentByPostId } from "@/lib/query/comment";

/**
 * Props for CommentList
 *
 * postId → tells which post's comments to load
 */
type CommentListProps = {
  postId: string;
};

/**
 * CommentList (Server Component)
 *
 * Responsibility:
 * - Fetch all comments of a post
 * - Separate top-level comments
 * - Render them in threaded (tree) form
 *
 * Why Server Component? 🧠
 * - Direct DB access
 * - Faster initial render
 * - No client JS needed
 */
const CommentList: React.FC<CommentListProps> = async ({ postId }) => {
  // 📥 Fetch ALL comments (parents + replies)
  const comments = await fetchCommentByPostId(postId);

  /**
   * 🌳 Top-level comments
   *
   * parentId === null → this is a root comment
   * Replies will be handled inside CommentShow
   */
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null
  );

  return (
    <section className="mt-8">
      {/* ================= HEADER ================= */}
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        💬 All {comments.length} comments
      </h2>

      {/* ================= COMMENTS ================= */}
      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <CommentShow
            key={comment.id} // 🔑 React list key
            postId={comment.postId}
            commentId={comment.id}
          />
        ))}
      </div>
    </section>
  );
};

export default CommentList;

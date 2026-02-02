import React from "react";
import CommentShow from "./comment-show";
import { fetchCommentByPostId } from "@/lib/query/comment";

type CommentListProps = {
  postId: string;
};

const CommentList: React.FC<CommentListProps> = async ({ postId }) => {
  const comments = await fetchCommentByPostId(postId);

  const topLevelComments = comments.filter((comment) => comment.parentId === null);

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        All {comments.length} comments
      </h2>

      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <CommentShow key={comment.id} postId={comment.postId} commentId={comment.id} />
        ))}
      </div>
    </section>
  );
};

export default CommentList;
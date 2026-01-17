import { fetchCommentByPostId } from "@/lib/query/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentCreateForm from "./comment-create-form";

type CommentShowProps = {
  postId: string;
  commentId: string;
  depth?: number;
};

const CommentShow = async ({
  postId,
  commentId,
  depth = 0,
}: CommentShowProps) => {
  const comments = await fetchCommentByPostId(postId);
  const comment = comments.find((c) => c.id === commentId);

  if (!comment) return null;

  const children = comments.filter((c) => c.parentId === commentId);

  return (
    <div
      className={`
        mt-4
        pl-4
        ${depth > 0 ? "border-l border-gray-200 ml-6" : ""}
      `}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.image || ""} />
          <AvatarFallback>
            {comment.user.name?.[0]?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">
            {comment.user.name || "Anonymous"}
          </p>

          <p className="mt-1 text-gray-800 whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="mt-2">
            <CommentCreateForm
              postId={postId}
              parentId={comment.id}
            />
          </div>
        </div>
      </div>

      {children.map((child) => (
        <CommentShow
          key={child.id}
          postId={postId}
          commentId={child.id}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

export default CommentShow;

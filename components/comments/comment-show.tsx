import { fetchCommentByPostId } from "@/lib/query/comment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentCreateForm from "./comment-create-form";
import CommentMenu from "./comment-menu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type CommentShowProps = {
  postId: string;
  commentId: string;
  depth?: number;
};

const CommentShow = async ({ postId, commentId, depth = 0 }: CommentShowProps) => {
  const session = await getServerSession(authOptions);
  const comments = await fetchCommentByPostId(postId);
  const comment = comments.find((c) => c.id === commentId);

  if (!comment) return null;

  const children = comments.filter((c) => c.parentId === commentId);
  const isOwner = session?.user?.id === comment.userId;

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4" : "mt-4"} border-l-2 border-transparent hover:border-gray-200 pl-4 transition`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.user.image || ""} />
          <AvatarFallback className="bg-gray-200 text-xs">
            {comment.user.name?.[0]?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {comment.user.name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {isOwner && (
              <CommentMenu 
                commentId={comment.id} 
                postId={postId}
                content={comment.content}
              />
            )}
          </div>

          <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="mt-3">
            <CommentCreateForm 
              postId={postId} 
              parentId={comment.id}
              commentOwnerId={comment.userId} 
            />
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <div className="mt-2">
          {children.map((child) => (
            <CommentShow key={child.id} postId={postId} commentId={child.id} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentShow;
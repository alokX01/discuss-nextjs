"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { deleteComment } from "@/app/action/delete-comment";
import { toast } from "sonner";

type Props = {
  commentId: string;
  postId: string;
};

const CommentDeleteButton = ({ commentId, postId }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;

    setIsDeleting(true);

    try {
      await deleteComment(commentId, postId);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-600 transition disabled:opacity-50"
    >
      <X className="h-3 w-3" />
    </button>
  );
};

export default CommentDeleteButton;
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/action/delete-post";
import { toast } from "sonner";

type Props = {
  postId: string;
  slug: string;
};

const PostDeleteButton = ({ postId, slug }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this post? All comments will be deleted.")) return;

    setIsDeleting(true);

    try {
      await deletePost(postId, slug);
      // Toast will show after redirect, or you can remove it entirely
    } catch (error) {
      toast.error("Failed to delete post");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 className="h-3 w-3" />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
};

export default PostDeleteButton;
// components/posts/post-delete-button.tsx
//
// Client-side delete button for posts.
// Visible only to the post owner.
// Shows a confirmation dialog before deleting the post.

"use client";

import { useState } from "react";

// Next.js navigation helper
import { useRouter } from "next/navigation";

// UI components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Icon
import { Trash2 } from "lucide-react";

// Server action
import { deletePost } from "@/app/action/delete-post";

/**
 * Props
 *
 * postId → post to delete
 * slug   → topic slug (used for redirect)
 */
type PostDeleteButtonProps = {
  postId: string;
  slug: string;
};

/**
 * PostDeleteButton (Client Component)
 *
 * Responsibility:
 * - Ask for confirmation before deletion
 * - Call server action to delete post
 * - Redirect handled on server
 *
 * Why client component?
 * - Uses modal interaction
 * - Handles loading state
 */
const PostDeleteButton = ({ postId, slug }: PostDeleteButtonProps) => {
  // Controls dialog open/close
  const [open, setOpen] = useState(false);

  // Prevents double clicks while deleting
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  /**
   * Trigger deletion
   *
   * Actual deletion happens on the server
   * Server action handles redirect after success
   */
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deletePost(postId, slug);
      // Redirect is handled inside server action
    } catch {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Delete trigger */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      {/* Confirmation modal */}
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete post</DialogTitle>
          <DialogDescription>
            This will permanently remove the post and all its comments.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          {/* Cancel */}
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          {/* Confirm delete */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostDeleteButton;

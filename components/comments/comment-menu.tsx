"use client";

import { useState } from "react";
import { useActionState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { deleteComment } from "@/app/action/delete-comment";
import { editComment } from "@/app/action/edit-comment";
import { toast } from "sonner";

type Props = {
  commentId: string;
  postId: string;
  content: string;
};

const CommentMenu = ({ commentId, postId, content }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const editAction = async (prevState: any, formData: FormData) => {
    const result = await editComment(commentId, postId, prevState, formData);
    if (result.errors && Object.keys(result.errors).length === 0) {
      toast.success("Comment updated");
      setEditOpen(false);
    }
    return result;
  };

  const [formState, formAction] = useActionState(editAction, { errors: {} });

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;

    setIsDeleting(true);
    setMenuOpen(false);

    try {
      await deleteComment(commentId, postId);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          disabled={isDeleting}
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-8 z-20 bg-white border rounded-lg shadow-lg py-1 min-w-[120px]">
              <button
                onClick={() => {
                  setEditOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-lg font-bold mb-4">Edit Comment</h2>

            <form action={formAction} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Comment</label>
                <Textarea
                  name="content"
                  defaultValue={content}
                  rows={4}
                  className="mt-1"
                />
                {formState.errors.content && (
                  <p className="text-xs text-red-600 mt-1">
                    {formState.errors.content.join(", ")}
                  </p>
                )}
              </div>

              {formState.errors.formError && (
                <p className="text-xs text-red-600">
                  {formState.errors.formError.join(", ")}
                </p>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentMenu;
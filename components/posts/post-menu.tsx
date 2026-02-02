"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { editPost } from "@/app/action/edit-post";
import { deletePost } from "@/app/action/delete-post";
import { toast } from "sonner";
import { useActionState } from "react";

type Props = {
  postId: string;
  slug: string;
  title: string;
  content: string;
};

const PostMenu = ({ postId, slug, title, content }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const editAction = async (prevState: any, formData: FormData) => {
    const result = await editPost(postId, slug, prevState, formData);
    if (result.errors && Object.keys(result.errors).length === 0) {
      toast.success("Post updated");
      setEditOpen(false);
    }
    return result;
  };

  const [formState, formAction] = useActionState(editAction, { errors: {} });

  const handleDelete = async () => {
    if (!confirm("Delete this post? All comments will be deleted.")) return;

    setIsDeleting(true);
    setMenuOpen(false);

    try {
      await deletePost(postId, slug);
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
          <MoreVertical className="h-5 w-5" />
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
            <h2 className="text-lg font-bold mb-4">Edit Post</h2>

            <form action={formAction} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input name="title" defaultValue={title} className="mt-1" />
                {formState.errors.title && (
                  <p className="text-xs text-red-600 mt-1">{formState.errors.title.join(", ")}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea name="content" defaultValue={content} rows={6} className="mt-1" />
                {formState.errors.content && (
                  <p className="text-xs text-red-600 mt-1">{formState.errors.content.join(", ")}</p>
                )}
              </div>

              {formState.errors.formError && (
                <p className="text-xs text-red-600">{formState.errors.formError.join(", ")}</p>
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

export default PostMenu;
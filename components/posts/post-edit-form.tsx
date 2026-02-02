"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { editPost } from "@/app/action/edit-post";

type Props = {
  postId: string;
  slug: string;
  title: string;
  content: string;
};

const PostEditForm = ({ postId, slug, title, content }: Props) => {
  const [open, setOpen] = useState(false);

  const editAction = async (prevState: any, formData: FormData) => {
    const result = await editPost(postId, slug, prevState, formData);
    return result;
  };

  const [formState, formAction] = useActionState(editAction, { errors: {} });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>

      {open && (
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
                  onClick={() => setOpen(false)}
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

export default PostEditForm;
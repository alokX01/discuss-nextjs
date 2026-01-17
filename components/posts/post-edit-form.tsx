// components/posts/post-edit-form.tsx
//
// Client-side form for editing an existing post.
// This is shown only to the post owner and opens inside a modal dialog.

"use client";

// React hook for handling server actions with form state
import { useActionState } from "react";

// UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Icon for edit action
import { Pencil } from "lucide-react";

// Server action that updates the post
import { editPost } from "@/app/action/edit-post";

/**
 * Props definition
 *
 * postId  → which post to edit
 * slug    → topic slug (used for redirect after edit)
 * title   → existing title (prefilled)
 * content → existing content (prefilled)
 */
type PostEditFormProps = {
  postId: string;
  slug: string;
  title: string;
  content: string;
};

/**
 * PostEditForm (Client Component)
 *
 * Responsibility:
 * - Open edit form in modal
 * - Prefill existing post data
 * - Submit updates via server action
 *
 * Why client component?
 * - Uses modal interaction
 * - Handles form submission state
 */
const PostEditForm = ({
  postId,
  slug,
  title,
  content,
}: PostEditFormProps) => {

  /**
   * Wrapper around server action
   *
   * editPost expects:
   * (postId, slug, prevState, formData)
   *
   * useActionState expects:
   * (prevState, formData)
   *
   * So we bind postId & slug here.
   */
  const editPostAction = (prevState: any, formData: FormData) => {
    return editPost(postId, slug, prevState, formData);
  };

  // Form state + submit handler
  const [formState, formAction] = useActionState(editPostAction, {
    errors: {},
  });

  return (
    <Dialog>
      {/* Trigger button (small, subtle) */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      {/* Modal content */}
      <DialogContent className="max-w-md">
        <form action={formAction}>
          {/* Modal header */}
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
          </DialogHeader>

          {/* Form fields */}
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-1">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={title}
              />
              {formState.errors.title && (
                <p className="text-sm text-red-600">
                  {formState.errors.title}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                defaultValue={content}
                rows={6}
                className="leading-relaxed"
              />
              {formState.errors.content && (
                <p className="text-sm text-red-600">
                  {formState.errors.content}
                </p>
              )}
            </div>

            {/* General error */}
            {formState.errors.formError && (
              <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                {formState.errors.formError}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <DialogFooter>
            <Button type="submit" className="w-full">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostEditForm;

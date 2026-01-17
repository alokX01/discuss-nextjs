"use client";

// React hooks
// useState  -> controls open / close state of form
// useEffect -> reacts to form submission result
import React, { useState, useEffect } from "react";

// useActionState
// Used to connect form submission with a Server Action
// Manages loading + error state returned from the server
import { useActionState } from "react";

// UI components
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// Server Action to create a comment
import { createComment } from "@/app/action/create-comment";

/**
 * Props for CommentCreateForm
 *
 * postId:
 * - ID of the post this comment belongs to
 *
 * parentId:
 * - ID of parent comment (only present for replies)
 *
 * startOpen:
 * - If true, form is visible by default
 * - Used for top-level comment forms
 */
type CommentCreateFormProps = {
  postId: string;
  parentId?: string;
  startOpen?: boolean;
};

/**
 * CommentCreateForm (Client Component)
 *
 * Responsibility:
 * - Create new comments and replies
 * - Handle form visibility
 * - Display validation errors
 *
 * Why Client Component?
 * - Uses state
 * - Uses browser-only hooks
 * - Handles form interaction
 */
const CommentCreateForm: React.FC<CommentCreateFormProps> = ({
  postId,
  parentId,
  startOpen,
}) => {
  /**
   * Controls whether the form is visible
   */
  const [open, setOpen] = useState(startOpen ?? false);

  /**
   * Wrapper for server action
   *
   * createComment expects:
   * - params object
   * - previous state
   * - form data
   *
   * This wrapper injects postId and parentId automatically
   */
  const createCommentWithParams = (
    prevState: any,
    formData: FormData
  ) => {
    return createComment(
      { postId, parentId },
      prevState,
      formData
    );
  };

  /**
   * useActionState
   *
   * formState:
   * - contains validation errors returned from server
   *
   * formAction:
   * - attached to <form action={formAction}>
   */
  const [formState, formAction] = useActionState(
    createCommentWithParams,
    { errors: {} }
  );

  /**
   * Side effect after successful submission
   *
   * When:
   * - no validation errors
   * - form was open
   *
   * Result:
   * - Server Action revalidates path
   * - UI refreshes automatically
   */
  useEffect(() => {
    if (
      formState.errors &&
      Object.keys(formState.errors).length === 0 &&
      open
    ) {
      // No manual reset needed
    }
  }, [formState, open]);

  return (
    <div className="mt-2">
      {/* Reply button (shown only when form is closed) */}
      {!startOpen && (
        <Button
          size="sm"
          variant="link"
          onClick={() => setOpen(!open)}
          className="px-0 text-sm text-gray-600"
        >
          Reply
        </Button>
      )}

      {/* Comment form */}
      {open && (
        <form action={formAction} className="space-y-3">
          {/* Comment textarea */}
          <Textarea
            name="content"
            placeholder="Write your comment..."
            className="resize-none bg-gray-50 focus-visible:ring-0"
          />

          {/* Field-level validation error */}
          {formState.errors.content && (
            <p className="text-sm text-red-600">
              {formState.errors.content}
            </p>
          )}

          {/* Form-level error */}
          {formState.errors.formError && (
            <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
              {formState.errors.formError}
            </div>
          )}

          {/* Submit button */}
          <Button size="sm" variant="secondary" type="submit">
            Post
          </Button>
        </form>
      )}
    </div>
  );
};

export default CommentCreateForm;

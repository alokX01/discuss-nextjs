// "use client" directive - this is a Client Component
// Client Components run in the browser and can use React hooks
"use client";

// Import React hooks
// useState - manages component state (like open/closed state)
// useEffect - runs side effects when dependencies change
import React, { useState, useEffect } from "react";

// useActionState - React 19+ hook for handling form state with server actions
// Replaces the older useFormState hook from react-dom
import { useActionState } from "react";

// Import UI components (relative imports from ui folder)
// Button - clickable button component
import { Button } from "../ui/button";

// Textarea - multi-line text input component
import { Textarea } from "../ui/textarea";

// Import server action that handles comment creation
// Server Actions run on the server, not in the browser
import { createComment } from "@/app/action/create-comment";

/**
 * TypeScript type definition for component props
 * 
 * This defines what props CommentCreateForm expects:
 * - postId: string (required) - ID of the post this comment belongs to
 * - parentId?: string (optional) - ID of parent comment if this is a reply
 * - startOpen?: boolean (optional) - whether form should be open by default
 */
type CommentCreateFormProps = {
  postId: string;        // Required: The post ID this comment is for
  parentId?: string;     // Optional: If replying to a comment, this is the parent comment ID
  startOpen?: boolean;   // Optional: Whether the form should be visible initially
};

/**
 * CommentCreateForm Component
 * 
 * This component creates a form to add comments to posts.
 * It supports both top-level comments and replies (nested comments).
 * 
 * Features:
 * - Can be shown/hidden with a toggle button
 * - Supports nested comments (replies)
 * - Validates input on the server
 * - Shows error messages
 * 
 * @param postId - The post this comment belongs to
 * @param parentId - Optional parent comment ID for replies
 * @param startOpen - Whether form should be visible initially
 */
const CommentCreateForm: React.FC<CommentCreateFormProps> = ({
  postId,      // Destructure postId from props
  parentId,    // Destructure parentId from props (may be undefined)
  startOpen,   // Destructure startOpen from props (may be undefined)
}) => {
  // useState hook manages whether the form is open or closed
  // startOpen || false - use startOpen if provided, otherwise default to false
  // Returns: [open, setOpen]
  // - open: boolean - current state (is form visible?)
  // - setOpen: function - function to update the state
  const [open, setOpen] = useState(startOpen || false);
  
  // Wrapper function to pass postId and parentId to the server action
  // useActionState expects: (prevState, formData) => Promise
  // But createComment expects: ({postId, parentId}, prevState, formData) => Promise
  // So we create a wrapper that captures postId and parentId
  // prevState: any - previous form state containing errors
  // formData: FormData - form data from HTML form
  const createCommentWithParams = (prevState: any, formData: FormData) => {
    // Call server action with object containing postId and parentId
    // The object is the first parameter, then prevState, then formData
    return createComment({ postId, parentId }, prevState, formData);
  };
  
  // useActionState hook manages form state and server action execution
  // Parameters:
  // 1. createCommentWithParams - function to call on form submit
  // 2. { errors: {} } - initial state (empty errors object)
  // Returns:
  // - formState - current state (contains errors if validation fails)
  // - formAction - function to bind to form's action attribute
  const [formState, formAction] = useActionState(
    createCommentWithParams,
    { errors: {} }
  );

  // useEffect hook runs side effects when dependencies change
  // This effect checks if form submission was successful
  // Dependencies: [formState, open] - runs when these change
  useEffect(() => {
    // Check if form was submitted successfully
    // formState.errors exists AND has no keys (empty object) AND form is open
    // If all true, form submission was successful
    if (formState.errors && Object.keys(formState.errors).length === 0 && open) {
      // Form submitted successfully
      // The server action calls revalidatePath which refreshes the page
      // No need to do anything here - React will re-render automatically
    }
  }, [formState, open]);  // Run effect when formState or open changes

  return (
    <div>
      {/* Conditional rendering - only show "Reply" button if form starts closed */}
      {/* !startOpen means "if startOpen is false or undefined" */}
      {/* If startOpen is true, don't show the button (form is already open) */}
      {!startOpen && (
        // Button that toggles form visibility
        // size="sm" - small size button
        // variant="link" - link style (looks like a text link, not a button)
        // onClick - event handler that runs when button is clicked
        // setOpen(!open) - toggle the open state (if open is true, set to false, vice versa)
        <Button size={"sm"} variant={"link"} onClick={() => setOpen(!open)}>
          Reply
        </Button>
      )}
      
      {/* Conditional rendering - only show form if open is true */}
      {open && (
        // HTML form element
        // action={formAction} - connects form submission to server action
        // className="space-y-2" - vertical spacing between form elements (0.5rem = 8px)
        <form action={formAction} className="space-y-2">
          {/* Textarea for comment content */}
          {/* name="content" - this is what the server action receives */}
          {/* placeholder - hint text shown when textarea is empty */}
          {/* className - styling: gray background, no focus ring */}
          <Textarea
            name="content"
            placeholder="write a comment..."
            className="bg-gray-100 focus-visible:ring-0"
          />
          
          {/* Conditional error display for content field */}
          {/* Only show if formState.errors.content exists (validation failed) */}
          {formState.errors.content && (
            // Error message in red text
            <p className="text-red-600 text-sm">{formState.errors.content}</p>
          )}
          
          {/* General form-level error display */}
          {/* Shows errors not specific to a field (e.g., "must be logged in") */}
          {formState.errors.formError && (
            // Error box with red border and background
            <div className="bg-red-200 border border-red-600 text-sm p-2 rounded">
              {formState.errors.formError}
            </div>
          )}
          
          {/* Submit button */}
          {/* size="sm" - small size */}
          {/* variant="secondary" - secondary button style (less prominent) */}
          {/* type="submit" - triggers form submission when clicked */}
          <Button size={"sm"} variant={"secondary"} type="submit">
            Save
          </Button>
        </form>
      )}
    </div>
  );
};

// Export component so it can be imported in other files
export default CommentCreateForm;

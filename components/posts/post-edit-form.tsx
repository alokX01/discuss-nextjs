// components/posts/post-edit-form.tsx
//
// This component creates a form in a dialog to edit existing posts.
// Only the post owner can see and use this form.

// "use client" directive - this is a Client Component
// Client Components run in the browser and can use React hooks
"use client"

// Import React hook for handling form state (React 19+)
// useActionState - manages form state and handles async server actions
import { useActionState } from "react";

// Import UI components from shadcn/ui component library
// Button - clickable button component
import { Button } from "@/components/ui/button";

// Dialog components - modal/popup dialog system
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Input - text input field component
import { Input } from "@/components/ui/input";

// Label - form label for accessibility
import { Label } from "@/components/ui/label";

// Textarea - multi-line text input component
import { Textarea } from "@/components/ui/textarea";

// Import icon from lucide-react
// Pencil - edit icon
import { Pencil } from "lucide-react";

// Import the server action that will handle form submission
// editPost - server action that updates the post
import { editPost } from "@/app/action/edit-post";

/**
 * TypeScript Type for Component Props
 * 
 * Defines what props PostEditForm expects:
 * - postId: string - The ID of the post to edit
 * - slug: string - The topic slug (for redirect after edit)
 * - title: string - Current post title (to pre-fill form)
 * - content: string - Current post content (to pre-fill form)
 */
type PostEditFormProps = {
    postId: string;  // Post ID to edit
    slug: string;    // Topic slug
    title: string;   // Current post title
    content: string; // Current post content
}

/**
 * PostEditForm Component (Client Component)
 * 
 * A form component that allows users to edit their posts.
 * It's displayed in a dialog/modal for a better UX.
 * 
 * Features:
 * - Opens in a dialog/modal
 * - Pre-fills with current post data
 * - Validates input using Zod (in server action)
 * - Shows error messages
 * - Uses useActionState hook to handle form state
 * 
 * @param postId - The post ID to edit
 * @param slug - The topic slug
 * @param title - Current post title
 * @param content - Current post content
 */
const PostEditForm: React.FC<PostEditFormProps> = ({ postId, slug, title, content }) => {
    // Wrapper function to pass postId and slug to the server action
    // useActionState expects: (prevState, formData) => Promise
    // But editPost expects: (postId, slug, prevState, formData) => Promise
    const editPostWithParams = (prevState: any, formData: FormData) => {
        return editPost(postId, slug, prevState, formData);
    };
    
    // useActionState hook manages form state and server action execution
    // Parameters:
    // 1. editPostWithParams - the function to call when form submits
    // 2. {errors:{}} - initial state (empty errors object)
    // Returns:
    // - formState - current state (contains errors if validation fails)
    // - action - function to bind to form's action attribute
    const [formState, action] = useActionState(editPostWithParams, {errors:{}});
    
  return (
    // Dialog component - creates a modal overlay
    <Dialog>
      {/* DialogTrigger - button that opens the dialog */}
      {/* asChild prop passes props to child component (Button) */}
      <DialogTrigger asChild>
        {/* Edit button with icon */}
        {/* variant="outline" - outlined button style */}
        {/* size="sm" - small size button */}
        <Button variant="outline" size="sm" className="gap-2">
          {/* Pencil icon - indicates edit action */}
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      
      {/* DialogContent - the visible modal box */}
      {/* sm:max-w-[425px] - max width 425px on small screens and up */}
      <DialogContent className="sm:max-w-[425px]">
        {/* HTML form element */}
        {/* action={action} - connects form submission to our server action */}
        <form action={action}>
          {/* Dialog header with title and description */}
          <DialogHeader>
            {/* Main title of the dialog */}
            <DialogTitle>Edit Post</DialogTitle>
            {/* Help text describing what the form does */}
            <DialogDescription>
              Update your post. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {/* Form fields container */}
          {/* grid - CSS Grid layout for responsive form fields */}
          {/* gap-4 - space between grid items (1rem = 16px) */}
          {/* py-4 - vertical padding (top and bottom) */}
          <div className="grid gap-4 py-4">
            {/* Title input field container */}
            <div>
              {/* Label links to input via htmlFor/id for accessibility */}
              <Label htmlFor="edit-title">Title</Label>
              {/* Text input for post title */}
              {/* defaultValue={title} - pre-fills with current title */}
              {/* id="edit-title" matches htmlFor in Label */}
              {/* name="title" - this is what the server action receives */}
              <Input id="edit-title" name="title" defaultValue={title} />
            </div>
            
            {/* Conditional error display for title field */}
            {formState.errors.title && (
              <p className="text-sm text-red-600">{formState.errors.title}</p>
            )}
            
            {/* Content textarea field container */}
            <div>
              {/* Label for content field */}
              <Label htmlFor="edit-content">Content</Label>
              {/* Multi-line text input for post content */}
              {/* defaultValue={content} - pre-fills with current content */}
              <Textarea id="edit-content" name="content" defaultValue={content} rows={6} />
            </div>
            
            {/* Conditional error display for content field */}
            {formState.errors.content && (
              <p className="text-sm text-red-600">{formState.errors.content}</p>
            )}
            
            {/* General form-level error (e.g., authorization errors) */}
            {formState.errors.formError && (
              <div className="border border-red-600 bg-red-200 p-2 rounded">
                {formState.errors.formError}
              </div>
            )}
          </div>
          
          {/* Dialog footer with action button */}
          <DialogFooter>
            {/* Submit button */}
            {/* type="submit" - triggers form submission */}
            {/* className="w-full" - makes button take full width */}
            <Button type="submit" className="w-full">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Export component for use in other files
export default PostEditForm;


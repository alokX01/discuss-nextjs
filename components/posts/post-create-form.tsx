// "use client" directive - this is a Client Component
// Client Components can use React hooks, event handlers, and browser APIs
"use client"

// Import React hook for handling form state with server actions (React 19+)
// useActionState manages form state and handles async server actions
import { useActionState } from "react";

// Import UI components from shadcn/ui component library
// Button - clickable button with different variants (default, outline, etc.)
import { Button } from "@/components/ui/button";

// Dialog components for modal/popup functionality
// Dialog - root container for modal dialog
// DialogTrigger - element that opens the dialog (usually a button)
// DialogContent - the visible modal box with content
// DialogHeader - header section (title, description)
// DialogTitle - the title text of the dialog
// DialogDescription - subtitle/help text
// DialogFooter - footer section typically containing action buttons
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Input - single-line text input component
import { Input } from "@/components/ui/input";

// Label - form label for accessibility (links label to input via htmlFor/id)
import { Label } from "@/components/ui/label";

// Textarea - multi-line text input component for longer content
import { Textarea } from "@/components/ui/textarea"; 

// Import the server action that handles post creation
// Server Actions are async functions that run on the server
// They're secure because the code never reaches the browser
import { createPost } from "@/app/action/create-post";

/**
 * TypeScript type definition for component props
 * 
 * This defines what props the PostCreateForm component expects
 * slug: string - the topic slug (URL-friendly identifier) where the post will be created
 */
type CreatePostFormProps = {
    slug: string;  // The topic slug (e.g., "javascript", "react", etc.)
}

/**
 * PostCreateForm Component
 * 
 * A form component that allows users to create new posts within a topic.
 * It's displayed in a dialog/modal for a better UX.
 * 
 * @param slug - The topic slug where this post will be created
 * 
 * How it works:
 * 1. User clicks "New a Post" button (DialogTrigger)
 * 2. Dialog opens with form
 * 3. User fills in title and content
 * 4. Form submits to server action (createPost)
 * 5. Server validates, creates post, redirects to post page
 */
const PostCreateForm : React.FC<CreatePostFormProps> = ({slug}) => {
    // Wrapper function to pass slug to the server action
    // useActionState expects a function with signature: (prevState, formData) => Promise
    // But createPost has signature: (slug, prevState, formData) => Promise
    // So we create a wrapper that captures slug in closure
    // prevState: any - previous form state (contains errors, etc.)
    // formData: FormData - form data from the HTML form
    const createPostWithSlug = (prevState: any, formData: FormData) => {
        // Call the server action with slug, prevState, and formData
        // The server action will validate and create the post
        return createPost(slug, prevState, formData);
    };
    
    // useActionState hook manages form state and server action execution
    // Parameters:
    // 1. createPostWithSlug - the function to call when form submits
    // 2. {errors:{}} - initial state (empty errors object)
    // Returns:
    // - formState - current state (contains errors if validation fails)
    // - action - function to bind to form's action attribute
    const [formState, action] = useActionState(createPostWithSlug, {errors:{}});
    
  return (
    // Dialog component - creates a modal overlay
    <Dialog>
      {/* DialogTrigger - button that opens the dialog */}
      {/* asChild prop passes props to child component (Button) */}
      <DialogTrigger asChild>
        <Button>New a Post</Button>
      </DialogTrigger>
      
      {/* DialogContent - the visible modal box */}
      {/* sm:max-w-[425px] - max width 425px on small screens and up */}
      <DialogContent className="sm:max-w-[425px]">
        {/* HTML form element */}
        {/* action={action} - connects form submission to our server action */}
        {/* When form submits, it calls createPostWithSlug which calls createPost */}
        <form action={action}>
          {/* Dialog header with title and description */}
          <DialogHeader>
            {/* Main title of the dialog */}
            <DialogTitle>Create a Post</DialogTitle>
            {/* Help text describing what the form does */}
            <DialogDescription>
              Write a new post. Click save when you are
              done.
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
              <Label htmlFor="title">Title</Label>
              {/* Text input for post title */}
              {/* id="title" matches htmlFor in Label */}
              {/* name="title" - this is what the server action receives */}
              <Input id="title" name="title" />
            </div>
            
            {/* Conditional rendering - only show if title has errors */}
            {/* formState.errors.title - array of error messages from validation */}
            {/* && operator - if left side is truthy, render right side */}
            {formState.errors.title && (
              <p className="text-sm text-red-600">{formState.errors.title}</p>
            )}
            
            {/* Content textarea field container */}
            <div>
              {/* Label for content field */}
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              {/* Multi-line text input for post content */}
              <Textarea id="content" name="content" />
            </div>
            
            {/* Conditional error display for content field */}
            {formState.errors.content && (
              <p className="text-sm text-red-600">{formState.errors.content}</p>
            )}
            
            {/* General form-level error (e.g., authentication errors) */}
            {/* formError is used for errors not specific to a single field */}
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
export default PostCreateForm;


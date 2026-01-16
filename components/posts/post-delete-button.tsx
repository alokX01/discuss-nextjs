// components/posts/post-delete-button.tsx
//
// This component provides a delete button for posts.
// Only the post owner can see and use this button.

// "use client" directive - this is a Client Component
// Client Components run in the browser and can use React hooks
"use client"

// Import React hooks
// useState - manages component state (like confirmation dialog state)
import { useState } from "react";

// Import Next.js navigation hook
// useRouter - provides methods to navigate programmatically
import { useRouter } from "next/navigation";

// Import UI components
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

// Import icon from lucide-react
// Trash2 - delete/trash icon
import { Trash2 } from "lucide-react";

// Import the server action that will handle post deletion
// deletePost - server action that deletes the post
import { deletePost } from "@/app/action/delete-post";

/**
 * TypeScript Type for Component Props
 * 
 * Defines what props PostDeleteButton expects:
 * - postId: string - The ID of the post to delete
 * - slug: string - The topic slug (for redirect after deletion)
 */
type PostDeleteButtonProps = {
    postId: string;  // Post ID to delete
    slug: string;   // Topic slug
}

/**
 * PostDeleteButton Component (Client Component)
 * 
 * A button component that allows users to delete their posts.
 * It shows a confirmation dialog before deleting.
 * 
 * Features:
 * - Shows confirmation dialog before deletion
 * - Only post owner can see/use this button
 * - Handles errors gracefully
 * - Redirects after successful deletion
 * 
 * @param postId - The post ID to delete
 * @param slug - The topic slug
 */
const PostDeleteButton: React.FC<PostDeleteButtonProps> = ({ postId, slug }) => {
    // useState hook manages whether the dialog is open
    // open - current state (is dialog visible?)
    // setOpen - function to update the state
    const [open, setOpen] = useState(false);
    
    // useState hook manages loading state during deletion
    // isDeleting - current state (is deletion in progress?)
    // setIsDeleting - function to update the state
    const [isDeleting, setIsDeleting] = useState(false);
    
    // useRouter hook provides navigation methods
    // router - object with navigation methods
    const router = useRouter();

    /**
     * Handle Delete Action
     * 
     * This function is called when user confirms deletion.
     * It calls the server action and handles the result.
     */
    const handleDelete = async () => {
        // Set loading state to true (show loading indicator)
        setIsDeleting(true);
        
        try {
            // Call the server action to delete the post
            // deletePost - server action that deletes the post
            // This will throw an error if deletion fails
            await deletePost(postId, slug);
            
            // If successful, the server action redirects
            // So we don't need to do anything here
        } catch (error) {
            // Handle errors
            // If deletion fails, show error and close dialog
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            } else {
                alert('Failed to delete post');
            }
            
            // Reset loading state
            setIsDeleting(false);
            
            // Close the dialog
            setOpen(false);
        }
    };

  return (
    // Dialog component - creates a modal overlay
    <Dialog open={open} onOpenChange={setOpen}>
      {/* DialogTrigger - button that opens the dialog */}
      {/* asChild prop passes props to child component (Button) */}
      <DialogTrigger asChild>
        {/* Delete button with icon */}
        {/* variant="destructive" - red/destructive button style */}
        {/* size="sm" - small size button */}
        <Button variant="destructive" size="sm" className="gap-2">
          {/* Trash2 icon - indicates delete action */}
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      
      {/* DialogContent - the visible modal box */}
      <DialogContent>
        {/* Dialog header */}
        <DialogHeader>
          {/* Title of the dialog */}
          <DialogTitle>Delete Post</DialogTitle>
          {/* Warning message */}
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {/* Dialog footer with action buttons */}
        <DialogFooter>
          {/* Cancel button */}
          {/* variant="outline" - outlined button style */}
          {/* onClick - closes dialog when clicked */}
          {/* disabled={isDeleting} - disable while deletion is in progress */}
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          
          {/* Delete confirmation button */}
          {/* variant="destructive" - red/destructive button style */}
          {/* onClick - calls handleDelete function */}
          {/* disabled={isDeleting} - disable while deletion is in progress */}
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {/* Show loading text while deleting */}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export component for use in other files
export default PostDeleteButton;


// "use client" directive tells Next.js this is a Client Component
// Client Components run in the browser and can use React hooks, event handlers, etc.
// They are sent to the browser as JavaScript bundles
"use client"

// Import React hook for handling form state (React 19+)
// useActionState replaces the older useFormState hook
import { useActionState } from "react";

// Import UI components from shadcn/ui component library
// Button - clickable button component with variants
import { Button } from "@/components/ui/button";

// Dialog components - modal/popup dialog system
// Dialog - root container for the dialog
// DialogTrigger - button that opens the dialog
// DialogContent - the actual dialog content/box
// DialogHeader - header section of dialog
// DialogTitle - title text
// DialogDescription - subtitle/description text
// DialogFooter - footer section with action buttons
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

// Label - form label component (accessibility)
import { Label } from "@/components/ui/label";

// Textarea - multi-line text input component
import { Textarea } from "@/components/ui/textarea";

// Import the server action that will handle form submission
// Server Actions run on the server, not in the browser
// They're secure because the actual code never reaches the client
import { createTopics } from "@/app/action/create-topics";

/**
 * TopicCreateForm Component
 * 
 * This component creates a form in a dialog/modal to create new discussion topics.
 * It uses React Server Actions for form submission (runs on server).
 * 
 * Features:
 * - Opens in a dialog/modal
 * - Validates input using Zod (in server action)
 * - Shows error messages
 * - Uses useActionState hook to handle form state
 */
const TopicCreateForm = () => {
  // useActionState hook manages form state and handles async server actions
  // Parameters:
  // 1. createTopics - the server action function to call on submit
  // 2. {errors:{}} - initial state (empty errors object)
  // Returns:
  // - formState - current form state (contains errors, etc.)
  // - action - function to bind to form's action prop
  const [formState, action] = useActionState(createTopics, {errors:{}});
  
  return (
    // Dialog component - creates a modal/popup
    <Dialog>
      {/* DialogTrigger - button that opens the dialog */}
      {/* asChild prop makes this component pass its props to the child (Button) */}
      <DialogTrigger asChild>
        <Button>New Topic</Button>
      </DialogTrigger>
      
      {/* DialogContent - the actual modal content */}
      {/* className sets max width for smaller screens */}
      <DialogContent className="sm:max-w-[425px]">
        {/* HTML form element */}
        {/* action prop connects to our server action via useActionState */}
        {/* When form submits, it calls createTopics on the server */}
        <form action={action}>
          {/* Dialog header section */}
          <DialogHeader>
            {/* Title of the dialog */}
            <DialogTitle>Create a Topic</DialogTitle>
            {/* Description/subtitle */}
            <DialogDescription>
              Write a new topic to start discussion. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          
          {/* Form fields container */}
          {/* grid - CSS Grid layout */}
          {/* gap-4 - space between grid items */}
          {/* py-4 - padding top and bottom */}
          <div className="grid gap-4 py-4">
            {/* Name input field container */}
            <div>
              {/* Label for accessibility - "for" attribute links to input */}
              <Label htmlFor="name">Name</Label>
              {/* Text input field */}
              {/* id matches htmlFor in Label */}
              {/* name attribute is what the server action receives */}
              <Input id="name" name="name" />
            </div>
            
            {/* Conditional error display for name field */}
            {/* If formState.errors.name exists, show error message */}
            {/* && is React's conditional rendering - only render if condition is true */}
            {formState.errors.name && (
              <p className="text-sm text-red-600">{formState.errors.name}</p>
            )}
            
            {/* Description textarea field container */}
            <div>
              {/* Label for description field */}
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              {/* Multi-line text input */}
              <Textarea id="description" name="description" />
            </div>
            
            {/* Conditional error display for description field */}
            {formState.errors.description && (
              <p className="text-sm text-red-600">{formState.errors.description}</p>
            )}
            
            {/* General form error display (e.g., "you must be logged in") */}
            {/* Shows if there's a formError in the errors object */}
            {formState.errors.formError && (
              <div className="border border-red-600 bg-red-200 p-2 rounded">
                {formState.errors.formError}
              </div>
            )}
          </div>
          
          {/* Dialog footer with submit button */}
          <DialogFooter>
            {/* Submit button */}
            {/* type="submit" triggers form submission */}
            {/* className="w-full" makes button full width */}
            <Button type="submit" className="w-full">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Export the component so it can be imported in other files
export default TopicCreateForm;


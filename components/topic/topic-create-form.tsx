// components/topic/topic-create-form.tsx
//
// This component provides a modal form to create new discussion topics.
// It is used inside the sidebar and keeps the UI lightweight and clean.

"use client";

// React 19+ hook for handling server action form state
import { useActionState } from "react";

// UI components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Server action to create a topic
import { createTopics } from "@/app/action/create-topics";

/**
 * TopicCreateForm
 *
 * Responsibility:
 * - Allow users to create a new discussion topic
 * - Keep interaction minimal (dialog based)
 * - Show validation errors from server
 *
 * Why Client Component?
 * - Uses useActionState
 * - Handles form submission in browser
 */
const TopicCreateForm = () => {
  // Manages form state and server action execution
  const [formState, action] = useActionState(createTopics, {
    errors: {},
  });

  return (
    <Dialog>
      {/* Trigger button shown in sidebar */}
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Create topic
        </Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="sm:max-w-[420px]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>New topic</DialogTitle>
            <DialogDescription>
              Topics help organize discussions. Keep the name short and clear.
            </DialogDescription>
          </DialogHeader>

          {/* Form fields */}
          <div className="space-y-4 py-4">
            {/* Topic name */}
            <div className="space-y-1">
              <Label htmlFor="name">Topic name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. web-development"
              />
              {formState.errors.name && (
                <p className="text-sm text-red-600">
                  {formState.errors.name}
                </p>
              )}
            </div>

            {/* Topic description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What kind of discussions belong here?"
                rows={4}
              />
              {formState.errors.description && (
                <p className="text-sm text-red-600">
                  {formState.errors.description}
                </p>
              )}
            </div>

            {/* Form-level error */}
            {formState.errors.formError && (
              <div className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                {formState.errors.formError}
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopicCreateForm;

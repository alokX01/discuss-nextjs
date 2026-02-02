"use client";

import { useActionState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { createTopics } from "@/app/action/create-topics";

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

const TopicCreateForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formState, action] = useActionState(createTopics, { errors: {} });

  if (!session) {
    return (
      <Button onClick={() => router.push("/auth/login")} variant="outline" className="w-full">
        Login to Create
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Create Topic
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>New Topic</DialogTitle>
            <DialogDescription>
              Create a new discussion topic
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name">Topic Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. web-development"
              />
              {formState.errors.name && (
                <p className="text-sm text-red-600">{formState.errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What's this topic about?"
                rows={4}
              />
              {formState.errors.description && (
                <p className="text-sm text-red-600">{formState.errors.description}</p>
              )}
            </div>

            {formState.errors.formError && (
              <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                {formState.errors.formError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Create Topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TopicCreateForm;
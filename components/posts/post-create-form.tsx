"use client";

import { useActionState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
import { createPost } from "@/app/action/create-post";

type CreatePostFormProps = {
  slug: string;
};

const PostCreateForm: React.FC<CreatePostFormProps> = ({ slug }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const createPostWithSlug = (prevState: any, formData: FormData) => {
    return createPost(slug, prevState, formData);
  };

  const [formState, action] = useActionState(createPostWithSlug, { errors: {} });

  if (!session) {
    return (
      <Button onClick={() => router.push("/auth/login")}>
        Login to Post
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Post</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Share your thoughts with the community
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Post title..." />
              {formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">{formState.errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="What's on your mind?"
                rows={5}
              />
              {formState.errors.content && (
                <p className="text-sm text-red-600 mt-1">{formState.errors.content}</p>
              )}
            </div>

            {formState.errors.formError && (
              <div className="border border-red-600 bg-red-50 p-2 rounded text-sm text-red-600">
                {formState.errors.formError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostCreateForm;
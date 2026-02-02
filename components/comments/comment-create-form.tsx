"use client";

import { useActionState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { createComment } from "@/app/action/create-comment";
import { toast } from "sonner";

type CommentCreateFormProps = {
  postId: string;
  parentId?: string;
  commentOwnerId?: string;
};

const CommentCreateForm = ({ postId, parentId, commentOwnerId }: CommentCreateFormProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);

  const createCommentAction = (prevState: any, formData: FormData) => {
    hasSubmitted.current = true;
    return createComment({ postId, parentId }, prevState, formData);
  };

  const [formState, formAction] = useActionState(createCommentAction, { errors: {} });

  useEffect(() => {
    if (
      hasSubmitted.current &&
      formState.errors &&
      Object.keys(formState.errors).length === 0
    ) {
      toast.success(parentId ? "Reply posted" : "Comment posted");
      formRef.current?.reset();
      hasSubmitted.current = false;
    }
  }, [formState.errors, parentId]);

  // Hide if replying to own comment
  if (parentId && session?.user?.id === commentOwnerId) {
    return null;
  }

  // Loading state
  if (status === "loading") {
    return <div className="h-24 bg-gray-50 rounded animate-pulse" />;
  }

  // Not logged in
  if (!session) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Sign in to comment</p>
        <button
          onClick={() => router.push("/auth/login")}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <Textarea
        name="content"
        placeholder={parentId ? "Write a reply..." : "What are your thoughts?"}
        className="resize-none"
        rows={parentId ? 2 : 3}
      />

      {formState.errors.content && (
        <p className="text-sm text-red-600">{formState.errors.content.join(", ")}</p>
      )}

      {formState.errors.formError && (
        <p className="text-sm text-red-600">{formState.errors.formError.join(", ")}</p>
      )}

      <Button type="submit" size="sm">
        {parentId ? "Reply" : "Comment"}
      </Button>
    </form>
  );
};

export default CommentCreateForm;
// Import CommentCreateForm component
// CommentCreateForm - form component for creating comments on a post
import CommentCreateForm from "@/components/comments/comment-create-form";

// Import CommentList component
// CommentList - displays all comments for a post
import CommentList from "@/components/comments/comment-list";

// Import PostShow component
// PostShow - displays a single post with its details
import PostShow from "@/components/posts/post-show";

// Import Button UI component
// Button - clickable button component from shadcn/ui
import { Button } from "@/components/ui/button";

// Import icon from lucide-react
// ChevronLeft - left arrow icon (for back button)
import { ChevronLeft } from "lucide-react";

// Import Next.js Link component
// Link - client-side navigation component (faster than regular <a> tags)
import Link from "next/link";

// Import NextAuth function for server-side session retrieval
// getServerSession - gets the user session on the server
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains our authentication setup
import { authOptions } from "@/lib/auth";

// Import Next.js navigation redirect function
// redirect - sends user to a different URL
import { redirect } from "next/navigation";

// Import React library and Suspense component
// Suspense - React component for handling async component loading
import React, { Suspense } from "react";

/**
 * TypeScript Type for Page Props
 * 
 * Next.js App Router pages receive params as a prop.
 * In Next.js 15+, params is a Promise that must be awaited.
 * 
 * params - URL route parameters (from [slug] and [postId] folder names)
 * - slug: string - the topic slug (e.g., "javascript" from /topic/javascript/posts/123)
 * - postId: string - the post ID (e.g., "123" from /topic/javascript/posts/123)
 */
type PostShowPageProps = {
  params: Promise<{ slug: string; postId: string }>;  // Promise containing URL route parameters
};

/**
 * Post Show Page Component (Server Component)
 * 
 * Displays a single post with its comments and a form to add comments.
 * 
 * This is an async Server Component - it can process URL parameters.
 * Server Components run on the server and send HTML to the browser.
 * 
 * URL format: /topic/[slug]/posts/[postId]
 * Example: /topic/javascript/posts/abc123
 * 
 * Layout:
 * - Back button (links to topic page)
 * - Post content (PostShow component)
 * - Comment creation form
 * - Comment list (all comments and replies)
 * 
 * Features:
 * - Displays full post content
 * - Shows all comments with nested replies
 * - Allows users to comment and reply
 * - Loading states with Suspense
 * 
 * @param params - URL route parameters (contains slug and postId)
 */
const PostShowPage = async ({ params }: PostShowPageProps) => {
  // Get the current user's session from the server
  // This checks if the user is logged in
  const session = await getServerSession(authOptions);

  // Check if user is NOT authenticated
  // If not logged in, redirect to home page
  if (!session || !session.user) {
    redirect("/");
  }

  // Await the params Promise to get the actual parameters
  // In Next.js 15+, params is async and must be awaited
  // Destructure to get slug and postId from params
  const { slug, postId } = await params;

  return (
    // Main container
    // space-y-3 - vertical spacing between child elements (0.75rem = 12px)
    // p-4 - padding on all sides (1rem = 16px)
    <div className="space-y-3 p-4">
      {/* Back button - links back to the topic page */}
      {/* Link - Next.js Link component for client-side navigation */}
      {/* href - destination URL when clicked */}
      {/* Template literal builds URL: /topic/[slug] */}
      {/* Example: /topic/javascript */}
      <Link href={`/topic/${slug}`}>
        {/* Button component */}
        {/* variant="link" - link style button (looks like a text link) */}
        <Button variant="link" className="text-gray-600 hover:text-gray-900">
          {/* ChevronLeft icon - left arrow */}
          <ChevronLeft className="mr-1" />
          {/* Button text */}
          Back to {slug}
        </Button>
      </Link>

      {/* PostShow component - displays the post content */}
      {/* Suspense boundary - handles async component loading */}
      {/* Suspense - React component that shows fallback while child is loading */}
      {/* PostShow is async (fetches data), so it needs Suspense wrapper */}
      {/* fallback - what to show while PostShow is loading */}
      <Suspense fallback={
        <div className="border rounded-lg shadow-sm bg-white p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      }>
        {/* PostShow component - fetches and displays post data */}
        {/* postId={postId} - passes the post ID to fetch the post */}
        <PostShow postId={postId} />
      </Suspense>

      {/* Comment creation form */}
      {/* CommentCreateForm - form component for creating comments */}
      {/* postId={postId} - passes the post ID (comment belongs to this post) */}
      {/* startOpen={true} - form starts open (visible by default) */}
      {/* This allows users to immediately start typing a comment */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Add a Comment</h2>
        <CommentCreateForm postId={postId} startOpen />
      </div>

      {/* Comment list - displays all comments for this post */}
      {/* CommentList - component that fetches and displays comments */}
      {/* postId={postId} - passes the post ID to fetch comments */}
      {/* This is a Server Component, so it fetches data on the server */}
      <div className="mt-6">
        <CommentList postId={postId} />
      </div>
    </div>
  );
};

// Export component as default export
export default PostShowPage;

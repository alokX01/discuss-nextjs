// Import query function to fetch comments
// fetchCommentByPostId - fetches all comments for a post from the database
import { fetchCommentByPostId } from "@/lib/query/comment";

// Import React library
import React from "react";

// Import Avatar UI components
// Avatar - container for user profile picture
// AvatarImage - the actual image element
// AvatarFallback - fallback text/icon if image fails to load
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Import CommentCreateForm component
// CommentCreateForm - form component for creating replies to comments
import CommentCreateForm from "./comment-create-form";

/**
 * TypeScript Type for Component Props
 * 
 * Defines what props CommentShow expects:
 * - postId: string - The ID of the post these comments belong to
 * - commentId: string - The ID of the comment to display
 */
type CommentShowProps = {
  postId: string;   // The post ID (needed for fetching all comments)
  commentId: string; // The comment ID to display
};

/**
 * CommentShow Component (Server Component)
 * 
 * Displays a single comment and its replies (nested comments).
 * 
 * This is an async Server Component - it fetches data directly from the database.
 * Server Components run on the server and send HTML to the browser.
 * 
 * Features:
 * - Displays comment content, author, and avatar
 * - Recursively renders child comments (replies)
 * - Shows reply form for each comment
 * - Handles comment not found scenario
 * 
 * This component is recursive - it renders itself for child comments,
 * creating a tree structure for nested comments.
 * 
 * @param postId - The post ID that comments belong to
 * @param commentId - The comment ID to display
 */
const CommentShow: React.FC<CommentShowProps> = async ({
  postId,    // Destructure postId from props
  commentId, // Destructure commentId from props
}) => {
  // Fetch all comments for this post from the database
  // await - waits for the async database query to complete
  // This includes ALL comments (both this one and all others)
  const comments = await fetchCommentByPostId(postId);

  // Find the specific comment we want to display
  // comments.find() - searches array for comment matching the commentId
  // Returns the comment object or undefined if not found
  const comment = comments.find((c) => c.id === commentId);

  // Check if comment was not found
  if (!comment) {
    // Return null to render nothing (comment doesn't exist)
    // React returns null when component should render nothing
    return null;
  }

  // Filter to find child comments (replies to this comment)
  // comments.filter() - creates new array with comments whose parentId matches this comment's id
  // These are the replies/nested comments
  const children = comments.filter((c) => c.parentId === commentId);

  return (
    // Main container for the comment
    // m-4 - margin on all sides (1rem = 16px) - creates spacing between comments
    // p-4 - padding inside the container (1rem = 16px)
    // border - border around the container
    // rounded-lg - rounded corners (large radius)
    // bg-white - white background
    // shadow-sm - subtle shadow for depth
    <div className="m-4 p-4 border rounded-lg bg-white shadow-sm">
      {/* Comment content section */}
      {/* flex - flexbox layout (horizontal) */}
      {/* gap-3 - space between items (0.75rem = 12px) */}
      <div className="flex gap-3">
        {/* Avatar component - displays user profile picture */}
        <Avatar>
          {/* Avatar image - user's profile picture */}
          {/* src - image URL (or empty string if no image) */}
          {/* alt - alternative text for accessibility */}
          {/* comment.user.image || "" - use image URL or empty string */}
          <AvatarImage src={comment.user.image || ""} alt={comment.user.name || ""} />
          
          {/* Avatar fallback - shown if image fails to load */}
          {/* comment.user.name?.[0] - first letter of name (optional chaining) */}
          {/* ?.toUpperCase() - convert to uppercase (if name exists) */}
          {/* || "A" - default to "A" if no name */}
          <AvatarFallback>
            {comment.user.name?.[0]?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>
        
        {/* Comment text content section */}
        {/* flex-1 - takes up remaining space in flex container */}
        {/* space-y-3 - vertical spacing between child elements (0.75rem = 12px) */}
        <div className="flex-1 space-y-3">
          {/* Author name */}
          {/* text-gray-500 - medium gray text color */}
          {/* text-sm - small text size */}
          {/* font-medium - medium font weight */}
          <p className="text-gray-500 text-sm font-medium">
            {comment.user.name || "Anonymous"}
          </p>
          
          {/* Comment content/text */}
          {/* text-gray-800 - dark gray text color */}
          {/* leading-relaxed - increased line height for better readability */}
          {/* whitespace-pre-wrap - preserves line breaks in comment text */}
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
          
          {/* Reply form - allows users to reply to this comment */}
          {/* CommentCreateForm - form component for creating replies */}
          {/* postId - the post ID (required) */}
          {/* parentId - this comment's ID (makes the reply a child of this comment) */}
          <CommentCreateForm postId={comment.postId} parentId={comment.id} />
        </div>
      </div>
      
      {/* Child comments (replies) section */}
      {/* Recursively render CommentShow for each child comment */}
      {/* This creates a nested tree structure for comments */}
      {children.map((child) => (
        // CommentShow component - recursively renders child comment
        // key={child.id} - React requires unique key for list items (for performance)
        // postId - pass the post ID (needed for fetching comments)
        // commentId={child.id} - pass the child comment's ID to display it
        <CommentShow key={child.id} postId={postId} commentId={child.id} />
      ))}
    </div>
  );
};

// Export component so it can be imported in other files
export default CommentShow;

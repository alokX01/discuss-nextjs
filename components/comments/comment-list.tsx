// Import React library
import React from 'react';

// Import CommentShow component
// CommentShow - component that displays a single comment and its replies
import CommentShow from './comment-show';

// Import query function to fetch comments
// fetchCommentByPostId - fetches all comments for a post from the database
import { fetchCommentByPostId } from '@/lib/query/comment';

/**
 * TypeScript Type for Component Props
 * 
 * Defines what props CommentList expects:
 * - postId: string - The ID of the post to get comments for
 */
type CommentListProps = {
    postId: string;  // The post ID to fetch comments for
}

/**
 * CommentList Component (Server Component)
 * 
 * Displays all comments for a post, organized in a tree structure.
 * 
 * This is an async Server Component - it fetches data directly from the database.
 * Server Components run on the server and send HTML to the browser.
 * 
 * Features:
 * - Fetches all comments for a post
 * - Filters to show only top-level comments (no parent)
 * - Displays comment count
 * - Renders comments recursively (CommentShow handles nested comments)
 * 
 * @param postId - The ID of the post to display comments for
 */
const CommentList : React.FC<CommentListProps> = async ({postId}) => {
    // Fetch all comments for this post from the database
    // await - waits for the async database query to complete
    // This includes ALL comments (both top-level and replies)
    const comments = await fetchCommentByPostId(postId);

    // Filter to get only top-level comments (comments without a parent)
    // comments.filter() - creates new array with only matching items
    // comment.parentId == null - checks if comment has no parent (top-level comment)
    // == null checks for both null and undefined (loose equality)
    const topLevelComments = comments.filter((comment) => comment.parentId == null);

  return (
    <div>
        {/* Comment count header */}
        {/* font-bold - bold text */}
        {/* text-lg - large text size */}
        {/* comments.length - total number of comments (all levels) */}
        <h1 className='font-bold text-lg'>All {comments.length} comments</h1>
        
        {
            // Map over top-level comments to render each one
            // Only render top-level comments here (replies are rendered recursively by CommentShow)
            topLevelComments.map((comment) => (
                // CommentShow component displays a comment and its replies
                // key={comment.id} - React requires unique key for list items
                // postId - pass the post ID (needed for building URLs, etc.)
                // commentId - the ID of this comment to display
                <CommentShow 
                    key={comment.id} 
                    postId={comment.postId} 
                    commentId={comment.id}
                />
            ))
        }
    </div>
  );
}

// Export component so it can be imported in other files
export default CommentList;

// Import TypeScript type from Prisma generated types
// Comment type represents a comment record from the database
// This gives us type safety when working with comment data
import type { Comment } from "@prisma/client";

// Import Prisma client instance
// ".." means go up one directory (from lib/query to lib)
// prisma is the database client that lets us query the database
import { prisma } from "..";

/**
 * TypeScript Type: CommentWithAuthor
 * 
 * This is an extended type that includes user/author information with a Comment.
 * It uses TypeScript's intersection type (&) to combine types.
 * 
 * Contains:
 * - All fields from Comment (id, content, postId, userId, parentId, createdAt, etc.)
 * - user: Object with name and image fields (author information)
 * 
 * This type represents a comment with author data needed for display
 */
export type CommentWithAuthor = Comment & {
    user: { 
        name: string | null;   // Author's name (nullable - user might not have name set)
        image: string | null   // Author's profile image URL (nullable - user might not have image)
    }
}

/**
 * Query Function: fetchCommentByPostId
 * 
 * Fetches all comments for a specific post.
 * Includes author information (name and image) for each comment.
 * 
 * Uses Prisma to:
 * - Filter comments by post ID
 * - Include related user data (author name and image)
 * - Order by creation date (newest first)
 * 
 * Note: This fetches ALL comments (including nested/replies).
 * The component handles organizing them into a tree structure.
 * 
 * @param postId - The ID of the post to get comments for
 * @returns Promise<CommentWithAuthor[]> - Array of comments with author data
 */
export const fetchCommentByPostId = async (postId: string): Promise<CommentWithAuthor[]> => {
    // Prisma query: find many comments matching the criteria
    return prisma.comment.findMany({
        // where - filter condition (only comments for this post)
        where: { postId },  // Shorthand for: where: { postId: postId }
        
        // include - include related data in the results
        include: {
            // user - include the user/author data
            user: {
                // select - specify which fields to include (only name and image)
                // This is more efficient than including all user fields
                select: {
                    name: true,   // Include author's name
                    image: true   // Include author's profile image URL
                }
            }
        },
        // orderBy - sort the results
        orderBy: {
            createdAt: "desc"  // Sort by creation date, descending (newest first)
        }
    });
}

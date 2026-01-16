// "use server" directive - marks this file as containing Server Actions
// Server Actions run on the server, not in the browser
// They provide secure server-side execution while being callable from client components
'use server'

// Import NextAuth function for server-side session retrieval
// getServerSession - gets the user session on the server (secure, can't be tampered with)
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains our authentication setup (GitHub provider, callbacks, etc.)
import { authOptions } from "@/lib/auth";

// Import Prisma client instance
// Prisma is an ORM (Object-Relational Mapping) that provides type-safe database access
import { prisma } from "@/lib";

// Import Next.js cache revalidation function
// revalidatePath - tells Next.js to invalidate cached data for a specific path
// This ensures pages show fresh data after creating a comment
import { revalidatePath } from "next/cache";

// Import Zod validation library
// Zod validates data at runtime and provides TypeScript types
import { z } from "zod";

/**
 * Zod Validation Schema for Comment Creation
 * 
 * Defines validation rules for comment data:
 * - content: string, minimum 3 characters
 * 
 * Ensures comments have meaningful content before saving
 */
const createCommentSchema = z.object({
    content: z.string().min(3)  // Comment must be at least 3 characters long
});

/**
 * TypeScript Type for Comment Form State
 * 
 * Matches the structure returned by the server action
 * Used by useActionState hook in CommentCreateForm component
 * 
 * All error fields are optional because errors may not always exist
 */
type CreateCommentState = {
    errors: {
        content?: string[];     // Optional: validation errors for content field
        formError?: string[];   // Optional: general form errors (auth, database, etc.)
    }
}

/**
 * Server Action: createComment
 * 
 * Creates a new comment on a post. Supports both top-level comments and replies.
 * 
 * Parameters (first parameter is an object):
 * - postId: The ID of the post this comment belongs to (required)
 * - parentId: The ID of the parent comment if this is a reply (optional)
 * - prevState: Previous form state from useActionState
 * - formData: Form data from HTML form (content)
 * 
 * Flow:
 * 1. Validate form data with Zod
 * 2. Check user authentication
 * 3. Create comment in database
 * 4. Find topic for cache revalidation
 * 5. Revalidate cache and return success
 * 
 * @param params - Object containing postId and optional parentId
 * @param prevState - Previous form state
 * @param formData - Form data from the form submission
 * @returns Promise<CreateCommentState> - Form state with errors if validation fails
 */
export const createComment = async (
    { postId, parentId }: { postId: string; parentId?: string },  // Destructured parameters
    prevState: CreateCommentState,  // Previous form state
    formData: FormData              // Form data from HTML form
): Promise<CreateCommentState> => {

    // Validate form data using Zod schema
    // safeParse - validates without throwing errors
    // Returns { success: true, data: {...} } or { success: false, error: {...} }
    const result = createCommentSchema.safeParse({
        // Extract content from FormData
        // formData.get('content') - gets the value of textarea with name="content"
        content: formData.get('content'),
    });
    
    // Check if validation failed
    if (!result.success) {
        // Return validation errors to the client
        // flatten().fieldErrors - converts Zod errors to simple object
        // Example: { content: ["String must contain at least 3 character(s)"] }
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    // Get the current user's session from the server
    // This verifies the user is logged in
    // await - waits for async operation to complete
    const session = await getServerSession(authOptions);
    
    // Check if user is NOT authenticated
    // Must check all three: session, session.user, and session.user.id
    if (!session || !session.user || !session.user.id) {
        // Return authentication error
        return {
            errors: {
                formError: ['You have to login first to reply comment']  // Must be logged in
            }
        }
    }

    // Try to create the comment in the database
    // try/catch - handles potential database errors
    try {
        // Prisma create operation - inserts new comment record
        // await - waits for database operation to complete
        await prisma.comment.create({
            // data - the data to insert into the database
            data: {
                content: result.data.content,    // Validated content from Zod
                postId: postId,                  // ID of the post (from function parameter)
                userId: session.user.id,         // ID of the logged-in user
                parentId: parentId               // ID of parent comment (if replying, otherwise undefined/null)
                // If parentId is undefined, Prisma will set it to null (top-level comment)
            }
        });

    } catch (error: unknown) {
        // Handle database errors
        // error: unknown - TypeScript requires type checking before using error
        
        // Check if error is an Error instance (has .message property)
        if (error instanceof Error) {
            // Return the specific error message
            return {
                errors: {
                    formError: [error.message]  // e.g., "Foreign key constraint failed"
                }
            }
        } else {
            // If error is not an Error instance, return generic message
            return {
                errors: {
                    formError: ['Failed to reply comment']  // Generic error message
                }
            }
        }
    }

    // Find the topic that contains this post
    // We need the topic slug to revalidate the correct page cache
    // findFirst - returns the first matching record or null
    const topic = await prisma.topic.findFirst({
        // where - search condition
        // posts: { some: { id: postId } } - find topic where posts array contains a post with this id
        // This is a Prisma nested query - searches related records
        where: { posts: { some: { id: postId } } }
    });
    
    // Check if topic was not found (shouldn't happen, but safety check)
    if (!topic) {
        // Return error - couldn't find topic for revalidation
        return {
            errors: {
                formError: ['Failed to revalidate path']  // Topic not found (unexpected)
            }
        }
    }
    
    // Revalidate the post page cache
    // `/topic/${topic.slug}/posts/${postId}` - the post page path
    // Example: "/topic/javascript/posts/abc123"
    // This ensures the new comment appears immediately without page refresh
    revalidatePath(`/topic/${topic.slug}/posts/${postId}`);
    
    // Return success state (empty errors object)
    // This tells the client component that the comment was created successfully
    // The page will automatically refresh due to revalidatePath
    return {
        errors: {}  // Empty errors = success
    }
}

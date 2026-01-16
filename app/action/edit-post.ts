// app/action/edit-post.ts
//
// Server Action for editing/updating posts.
// Only the post owner can edit their own posts.

// "use server" directive - marks this file as containing Server Actions
// Server Actions run on the server, not in the browser
'use server'

// Import NextAuth function for server-side session retrieval
// getServerSession - gets the user session on the server (secure)
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains our authentication setup
import { authOptions } from "@/lib/auth";

// Import Prisma client instance
// Prisma is an ORM for type-safe database operations
import { prisma } from "@/lib";

// Import Next.js cache revalidation function
// revalidatePath - invalidates cached data for a specific path
import { revalidatePath } from "next/cache";

// Import Next.js navigation redirect function
// redirect - sends user to a different URL
import { redirect } from "next/navigation";

// Import Zod validation library
// Zod provides runtime type validation and parsing
import { z } from "zod";

/**
 * Zod Validation Schema for Post Editing
 * 
 * Defines validation rules for post data:
 * - title: string, minimum 3 characters
 * - content: string, minimum 10 characters
 */
const editPostSchema = z.object({
    title: z.string().min(3),      // Title must be at least 3 characters
    content: z.string().min(10)    // Content must be at least 10 characters
});

/**
 * TypeScript Type for Edit Post Form State
 * 
 * Matches the structure returned by the server action
 * Used by useActionState hook in the client component
 */
type EditPostFormState = {
    errors: {
        title?: string[];      // Optional: validation errors for title field
        content?: string[];    // Optional: validation errors for content field
        formError?: string[]   // Optional: general form errors (auth, authorization, etc.)
    }
}

/**
 * Server Action: editPost
 * 
 * Updates an existing post. Only the post owner can edit.
 * 
 * Parameters:
 * - postId: The ID of the post to edit
 * - slug: The topic slug (for redirect after edit)
 * - prevState: Previous form state from useActionState
 * - formData: Form data from HTML form (title, content)
 * 
 * Flow:
 * 1. Validate form data with Zod
 * 2. Check user authentication
 * 3. Verify post exists
 * 4. Verify user owns the post (authorization)
 * 5. Update post in database
 * 6. Revalidate cache and redirect to post page
 * 
 * @param postId - Post ID to edit
 * @param slug - Topic slug (for redirect)
 * @param prevState - Previous form state
 * @param formData - Form data from the form submission
 * @returns Promise<EditPostFormState> - Form state with errors if validation fails
 */
export const editPost = async (
    postId: string,                // Post ID to edit
    slug: string,                  // Topic slug (for redirect)
    prevState: EditPostFormState,  // Previous form state
    formData: FormData             // Form data from HTML form
): Promise<EditPostFormState> => {
 
    // Validate form data using Zod schema
    // safeParse - validates without throwing errors
    const result = editPostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content')
    });
    
    // Check if validation failed
    if (!result.success) {
        // Return validation errors to the client
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    // Get the current user's session from the server
    // This verifies the user is logged in
    const session = await getServerSession(authOptions);

    // Check if user is NOT authenticated
    if (!session || !session.user || !session.user.id) {
        // Return authentication error
        return {
            errors: {
                formError: ['You must be logged in to edit posts']
            }
        }
    }

    // Find the post in the database
    // We need to check if it exists and who owns it
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            userId: true,  // We need this to check ownership
            topic: {
                select: {
                    slug: true  // We need this for redirect
                }
            }
        }
    });
    
    // Check if post was not found
    if (!post) {
        return {
            errors: {
                formError: ['Post not found']
            }
        }
    }

    // Authorization check: Verify user owns the post
    // Only the post owner can edit their post
    if (post.userId !== session.user.id) {
        return {
            errors: {
                formError: ['You can only edit your own posts']
            }
        }
    }

    // Try to update the post in the database
    try {
        // Prisma update operation - updates the post record
        await prisma.post.update({
            where: { id: postId },
            data: {
                title: result.data.title,      // Validated title from Zod
                content: result.data.content   // Validated content from Zod
            }
        });
    } catch (error: unknown) {
        // Handle database errors
        if (error instanceof Error) {
            return {
                errors: {
                    formError: [error.message]
                }
            }
        } else {
            return {
                errors: {
                    formError: ['Failed to update post.']
                }
            }
        }
    }
 
    // Revalidate the post page cache
    // This ensures the updated post appears immediately
    revalidatePath(`/topic/${slug}/posts/${postId}`);
    
    // Redirect user back to the post page
    // redirect() throws an error internally (expected) to stop execution
    redirect(`/topic/${slug}/posts/${postId}`);
}


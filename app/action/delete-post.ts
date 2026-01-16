// app/action/delete-post.ts
//
// Server Action for deleting posts.
// Only the post owner can delete their own posts.

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

/**
 * Server Action: deletePost
 * 
 * Deletes a post. Only the post owner can delete.
 * 
 * Parameters:
 * - postId: The ID of the post to delete
 * - slug: The topic slug (for redirect after deletion)
 * 
 * Flow:
 * 1. Check user authentication
 * 2. Verify post exists
 * 3. Verify user owns the post (authorization)
 * 4. Delete post from database
 * 5. Revalidate cache and redirect to topic page
 * 
 * @param postId - Post ID to delete
 * @param slug - Topic slug (for redirect)
 */
export const deletePost = async (postId: string, slug: string) => {
    // Get the current user's session from the server
    // This verifies the user is logged in
    const session = await getServerSession(authOptions);

    // Check if user is NOT authenticated
    if (!session || !session.user || !session.user.id) {
        // Throw error - user must be logged in
        throw new Error('You must be logged in to delete posts');
    }

    // Find the post in the database
    // We need to check if it exists and who owns it
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            userId: true,  // We need this to check ownership
        }
    });
    
    // Check if post was not found
    if (!post) {
        throw new Error('Post not found');
    }

    // Authorization check: Verify user owns the post
    // Only the post owner can delete their post
    if (post.userId !== session.user.id) {
        throw new Error('You can only delete your own posts');
    }

    // Try to delete the post from the database
    try {
        // Prisma delete operation - removes the post record
        // This will also delete related comments (cascade delete from schema)
        await prisma.post.delete({
            where: { id: postId }
        });
    } catch (error: unknown) {
        // Handle database errors
        if (error instanceof Error) {
            throw new Error(`Failed to delete post: ${error.message}`);
        } else {
            throw new Error('Failed to delete post');
        }
    }
 
    // Revalidate the topic page cache
    // This ensures the post list updates immediately
    revalidatePath(`/topic/${slug}`);
    
    // Redirect user back to the topic page
    // redirect() throws an error internally (expected) to stop execution
    redirect(`/topic/${slug}`);
}


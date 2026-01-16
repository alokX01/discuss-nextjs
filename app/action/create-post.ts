// "use server" directive - marks this file as containing Server Actions
// Server Actions run on the server, providing security and direct database access
// They can be called from Client Components but execute server-side
'use server'

// Import NextAuth function to get server-side session
// getServerSession - retrieves the user session on the server (more secure than client-side)
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains authentication setup (providers, callbacks, etc.)
import { authOptions } from "@/lib/auth";

// Import Prisma client instance
// Prisma is an ORM for type-safe database operations
import { prisma } from "@/lib"; 

// Import TypeScript type from Prisma generated types
// Post type matches the Post model in our Prisma schema
import { Post } from "@prisma/client";

// Import Next.js cache revalidation function
// revalidatePath - invalidates cached data for a specific path
// This ensures pages show fresh data after creating a post
import { revalidatePath } from "next/cache";

// Import Next.js navigation redirect function
// redirect - sends user to a different URL (throws internally to stop execution)
import { redirect } from "next/navigation";

// Import Zod validation library
// Zod provides runtime type validation and parsing
import {z} from "zod";

/**
 * Zod Validation Schema for Post Creation
 * 
 * Defines validation rules for post data:
 * - title: string, minimum 3 characters
 * - content: string, minimum 10 characters
 * 
 * These rules ensure posts have meaningful content before saving to database
 */
const createPostSchema = z.object({
    title: z.string().min(3),      // Title must be at least 3 characters
    content: z.string().min(10)    // Content must be at least 10 characters
});

/**
 * TypeScript Type for Post Form State
 * 
 * Matches the structure returned by the server action
 * Used by useActionState hook in the client component
 * 
 * All error fields are optional arrays of strings
 */
type CreatePostFormState = {
    errors: {
        title?: string[];      // Optional: validation errors for title field
        content?: string[];    // Optional: validation errors for content field
        formError?: string[]   // Optional: general form errors (auth, database, etc.)
    }
}

/**
 * Server Action: createPost
 * 
 * Creates a new post in a specific topic.
 * 
 * Parameters:
 * - slug: The topic slug where the post will be created
 * - prevState: Previous form state from useActionState
 * - formData: Form data from HTML form (title, content)
 * 
 * Flow:
 * 1. Validate form data with Zod
 * 2. Check user authentication
 * 3. Verify topic exists
 * 4. Create post in database
 * 5. Revalidate cache and redirect to post page
 * 
 * @param slug - Topic slug (URL-friendly identifier)
 * @param prevState - Previous form state
 * @param formData - Form data from the form submission
 * @returns Promise<CreatePostFormState> - Form state with errors if validation fails
 */
export const createPost = async (
    slug: string,                    // Topic slug from URL (e.g., "javascript")
    prevState: CreatePostFormState,  // Previous form state
    formData: FormData               // Form data from HTML form
): Promise<CreatePostFormState> => {
 
    // Validate form data using Zod schema
    // safeParse - validates without throwing errors
    // Returns { success: true, data: {...} } or { success: false, error: {...} }
    const result = createPostSchema.safeParse({
        // Extract values from FormData
        // formData.get('title') - gets the value of input with name="title"
        title: formData.get('title'),
        // formData.get('content') - gets the value of textarea with name="content"
        content: formData.get('content')
    });
    
    // Check if validation failed
    if(!result.success){
        // Return validation errors to the client
        // flatten().fieldErrors - converts Zod errors to simple object format
        // Example: { title: ["String must contain at least 3 character(s)"], content: [...] }
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    // Get the current user's session from the server
    // This verifies the user is logged in
    // await - waits for async operation to complete
    const session = await getServerSession(authOptions);

    // Check if user is NOT authenticated
    // Must check session, session.user, and session.user.id (all could be null/undefined)
    if(!session || !session.user || !session.user.id){
        // Return authentication error
        return {
            errors: {
                formError: ['You have to login first']  // User must be logged in
            }
        }
    }

    // Find the topic in the database using the slug
    // findFirst - returns the first matching record or null
    // where - specifies the search condition
    const topic = await prisma.topic.findFirst({
        where: { slug }  // Find topic where slug matches the provided slug
    });
    
    // Check if topic was not found
    if(!topic){
        // Return error - topic doesn't exist
        return {
            errors: {
                formError: ['Topic not found']  // Invalid topic slug
            }
        }
    }
    
    // Declare variable to hold the created post
    // Type: Post (from Prisma schema)
    let post: Post;

    // Try to create the post in the database
    // try/catch - handles potential database errors
    try {
        // Prisma create operation - inserts new post record
        // await - waits for database operation to complete
        post = await prisma.post.create({
            // data - the data to insert into the database
            data: {
                title: result.data.title,           // Validated title from Zod
                content: result.data.content,       // Validated content from Zod
                userId: session.user.id,            // ID of the logged-in user
                topicId: topic.id                   // ID of the topic (from database)
            }
        });
    } catch (error: unknown) {
        // Handle database errors
        // error: unknown - TypeScript requires type checking
        
        // Check if error is an Error instance
        if(error instanceof Error){
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
                    formError: ['Failed to create a post.']  // Generic error message
                }
            }
        }
    }
 
    // Revalidate the topic page cache
    // `/topic/${slug}` - the topic page path (e.g., "/topic/javascript")
    // This ensures the new post appears in the post list immediately
    revalidatePath(`/topic/${slug}`);
    
    // Redirect user to the newly created post page
    // redirect() throws an error internally (expected behavior) to stop execution
    // post.id - the ID of the post we just created
    // Example redirect: /topic/javascript/posts/abc123
    redirect(`/topic/${slug}/posts/${post.id}`);
}

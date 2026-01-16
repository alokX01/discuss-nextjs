// "use server" directive - this file contains Server Actions
// Server Actions are functions that run on the server, not in the browser
// They can be called from Client Components but execute on the server
// This is secure because sensitive code never reaches the browser
'use server'

// Import NextAuth function to get the current user session on the server
// getServerSession - gets the session from the server-side (secure)
// This is different from useSession which runs on the client
import { getServerSession } from "next-auth";

// Import auth configuration
// authOptions contains our NextAuth setup (providers, callbacks, etc.)
import { authOptions } from "@/lib/auth";

// Import Prisma client instance
// Prisma is an ORM (Object-Relational Mapping) tool for database access
// It provides type-safe database queries
import { prisma } from "@/lib";

// Import TypeScript type from Prisma
// Topic is the TypeScript type generated from our Prisma schema
// This gives us type safety when working with Topic objects
import { Topic } from "@prisma/client";

// Import Next.js cache revalidation function
// revalidatePath - tells Next.js to invalidate cached data for a specific path
// This ensures the page shows fresh data after we create a topic
import { revalidatePath } from "next/cache"; 

// Import Next.js redirect function
// redirect - sends the user to a different page
// This throws an error internally (expected behavior) to stop execution
import { redirect } from "next/navigation";

// Import Zod - a TypeScript-first schema validation library
// Zod validates data and ensures it matches expected types/shapes
import { z } from "zod";

/**
 * Zod Schema for Topic Creation Validation
 * 
 * This schema defines the validation rules for creating a topic:
 * - name: must be a string, minimum 3 characters, lowercase letters and hyphens only
 * - description: must be a string, minimum 10 characters
 * 
 * The regex /^[a-z-]+$/ ensures:
 * - ^ - start of string
 * - [a-z-] - lowercase letters or hyphens
 * - + - one or more characters
 * - $ - end of string
 * Example valid: "javascript", "react-native", "node-js"
 * Example invalid: "JavaScript" (uppercase), "react native" (space)
 */
const createTopicSchema = z.object({
    // name must be lowercase letters and hyphens only (for URL-friendly slugs)
    name: z.string().min(3).regex(/^[a-z-]+$/, { message: "Must be lowercase letter without spaces" }),
    // description must be at least 10 characters long
    description: z.string().min(10)
})

/**
 * TypeScript Type for Form State
 * 
 * This type defines the structure of the form state returned by the server action
 * It matches what useActionState expects in the client component
 * 
 * errors object can contain:
 * - name: array of error messages for the name field
 * - description: array of error messages for the description field
 * - formError: array of general form errors (e.g., "must be logged in")
 * 
 * All fields are optional (?) because errors may not always exist
 */
type CreateTopicFormState = {
    errors: {
        name?: string[];         // Optional: array of name validation errors
        description?: string[];  // Optional: array of description validation errors
        formError?: string[]     // Optional: array of general form errors
    }
}

/**
 * Server Action: createTopics
 * 
 * This function creates a new discussion topic.
 * It's a Server Action, meaning it runs on the server.
 * 
 * Flow:
 * 1. Validate form data using Zod
 * 2. Check if user is authenticated
 * 3. Create topic in database using Prisma
 * 4. Revalidate cache
 * 5. Redirect to the new topic page
 * 
 * @param prevState - Previous form state (contains previous errors)
 * @param formData - Form data from the HTML form (title, description, etc.)
 * @returns Promise<CreateTopicFormState> - Form state with errors (if any)
 */
export const createTopics = async (
    prevState: CreateTopicFormState,  // Previous form state from useActionState
    formData: FormData                 // Form data from the HTML form
): Promise<CreateTopicFormState> => {

    // Validate form data using Zod schema
    // safeParse - tries to validate data, returns object with success/error
    // Does NOT throw an error if validation fails (unlike parse)
    const result = createTopicSchema.safeParse({
        // formData.get('name') - gets the value of the 'name' input field
        name: formData.get('name'),
        // formData.get('description') - gets the value of the 'description' textarea
        description: formData.get('description')
    });

    // Check if validation failed
    if (!result.success) {
        // Return errors to the client component
        // result.error.flatten().fieldErrors - converts Zod errors to simple object
        // Example: { name: ["Must be at least 3 characters"], description: ["Required"] }
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    // Get the current user's session from the server
    // This checks if the user is logged in
    // await - waits for the async operation to complete
    const session = await getServerSession(authOptions);

    // Check if user is NOT authenticated
    // !session - no session exists
    // !session.user - session exists but no user data
    // !session.user.id - session exists but no user ID
    if (!session || !session.user || !session.user.id) {
        // Return error - user must be logged in to create topics
        return {
            errors: {
                formError: ['You have to login first!']
            }
        }
    }
    
    // Declare variable to hold the created topic
    // Type: Topic (from Prisma schema)
    let topic: Topic;
    
    // Try to create the topic in the database
    // try/catch - handles potential database errors
    try {
       // Prisma create operation - inserts a new record into the database
       // await - waits for database operation to complete
       topic = await prisma.topic.create({
            // data object - the data to insert
            data: {
                // slug - URL-friendly identifier (uses the validated name)
                // result.data.name - the validated name from Zod
                slug: result.data.name,
                // description - the validated description from Zod
                description: result.data.description
            }
        })
    } catch (error) {
        // If database operation fails, handle the error
        // error could be various types, so we check its type
        
        // Check if error is an Error instance (has .message property)
        if (error instanceof Error) {
            // Return the error message to the client
            return {
                errors: {
                    formError: [error.message]  // e.g., "Unique constraint failed"
                }
            }
        } else {
            // If error is not an Error instance, return generic message
            return {
                errors: {
                    formError: ['Something went wrong.']
                }
            }
        }
    }
    
    // Revalidate the home page cache
    // "/" - the home page path
    // This ensures the new topic appears in the topic list immediately
    revalidatePath("/");
    
    // Redirect user to the newly created topic page
    // redirect() throws an error internally (expected) to stop execution
    // topic.slug - the slug we just created (e.g., "javascript")
    // Example redirect: /topic/javascript
    redirect(`/topic/${topic.slug}`);
}

// "use server" directive - marks this file as containing Server Actions
// Server Actions run on the server, not in the browser
// They provide secure server-side execution
"use server";

// Import Next.js redirect function
// redirect - sends the user to a different URL
// Internally throws an error to stop execution (expected behavior)
import { redirect } from "next/navigation";

/**
 * Server Action: search
 * 
 * This function handles search form submissions.
 * It extracts the search term from the form and redirects to the search results page.
 * 
 * Flow:
 * 1. Get search term from form data
 * 2. Validate the search term (must be a non-empty string)
 * 3. Redirect to search results page with the term as a query parameter
 * 
 * @param formData - Form data from the search form (contains 'term' field)
 */
export const search = async (formData: FormData) => {
    // Extract search term from form data
    // formData.get('term') - gets the value of input with name="term"
    // Returns string | File | null
    const term = formData.get('term');

    // Validate the search term
    // Check if term is NOT a string OR if it's an empty string
    // typeof term !== "string" - ensures term is a string (not File or null)
    // !term - ensures term is not empty (empty string is falsy)
    if(typeof term !== "string" || !term){
        // If invalid, redirect to home page
        // This prevents searching with empty or invalid terms
        redirect("/");
    }

    // Redirect to search results page with the search term as a query parameter
    // `/search?term=${term}` - the search page URL with query parameter
    // Example: "/search?term=javascript"
    // The search page will read this query parameter and display results
    redirect(`/search?term=${term}`);
}

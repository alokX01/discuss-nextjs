// Import PostList component
// PostList - displays a list of posts in card format
import PostList from "@/components/posts/post-list";

// Import query function to search posts
// fetchPostBySearch - searches posts by title or content
import { fetchPostBySearch } from "@/lib/query/post";

// Import NextAuth function for server-side session retrieval
// getServerSession - gets the user session on the server
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains our authentication setup
import { authOptions } from "@/lib/auth";

// Import Next.js navigation redirect function
// redirect - sends user to a different URL
import { redirect } from "next/navigation";

// Import React library
import React from "react";

/**
 * TypeScript Type for Page Props
 * 
 * Next.js App Router pages receive searchParams as a prop.
 * In Next.js 15+, searchParams is a Promise that must be awaited.
 * 
 * searchParams - URL query parameters (e.g., ?term=javascript)
 * - term?: string - optional search term from URL query string
 */
type SearchPageProps = {
  searchParams: Promise<{ term?: string }>;  // Promise containing URL query parameters
};

/**
 * Search Page Component (Server Component)
 * 
 * Displays search results for posts.
 * 
 * This is an async Server Component - it can fetch data directly from the database.
 * Server Components run on the server and send HTML to the browser.
 * 
 * Flow:
 * 1. Extract search term from URL query parameters
 * 2. If no term, show message asking for search term
 * 3. If term exists, search posts and display results
 * 
 * URL format: /search?term=javascript
 * 
 * @param searchParams - URL query parameters (contains search term)
 */
const SearchPage: React.FC<SearchPageProps> = async ({ searchParams }) => {
  // Get the current user's session from the server
  // This checks if the user is logged in
  const session = await getServerSession(authOptions);

  // Check if user is NOT authenticated
  // If not logged in, redirect to home page
  if (!session || !session.user) {
    redirect("/");
  }

  // Await the searchParams Promise to get the actual parameters
  // In Next.js 15+, searchParams is async and must be awaited
  const params = await searchParams;
  
  // Extract search term from query parameters
  // params.term || "" - use term if it exists, otherwise default to empty string
  // || operator - if left side is falsy (undefined, null, empty), use right side
  const term = params.term || "";

  // Check if no search term was provided
  if (!term) {
    // Return empty state - ask user to enter a search term
    return (
      <div className="p-4">
        {/* Page heading */}
        <h1 className="text-xl font-bold">Search</h1>
        
        {/* Empty state message */}
        {/* text-gray-500 - gray text color */}
        <p className="text-gray-500">Please enter a search term</p>
      </div>
    );
  }

  // If search term exists, display search results
  return (
    <div className="p-4">
      {/* Search results heading */}
      {/* text-blue-600 - blue text color */}
      {/* font-medium - medium font weight */}
      {/* italic - italic text style */}
      {/* mb-4 - margin bottom (1rem = 16px) */}
      {/* Displays the search term that was used */}
      <h1 className="text-blue-600 font-medium italic mb-4">
        Search result for {term}
      </h1>
      
      {/* PostList component with search results */}
      {/* fetchData={() => fetchPostBySearch(term)} - passes a function that searches posts */}
      {/* Arrow function creates a function that calls fetchPostBySearch with the term */}
      {/* PostList will call this function to get the search results */}
      <PostList fetchData={() => fetchPostBySearch(term)} />
    </div>
  );
};

// Export component as default export
export default SearchPage;

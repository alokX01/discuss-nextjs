// "use client" directive - this is a Client Component
// Client Components run in the browser and can use React hooks
// This component needs to be a Client Component because it uses useSearchParams hook
"use client";

// Import React library
import React from "react";

// Import Input UI component
// Input - text input field component from shadcn/ui
import { Input } from "@/components/ui/input";

// Import Next.js hook for reading URL search parameters
// useSearchParams - hook to read query string parameters from URL (e.g., ?term=javascript)
// This is a Client Component hook, so this component must be a Client Component
import { useSearchParams } from "next/navigation";

// Import server action for handling search form submission
// search - server action that processes the search form and redirects to search page
import { search } from "@/app/action/search";

/**
 * SearchInput Component (Client Component)
 * 
 * Displays a search input field in the header.
 * 
 * This is a Client Component because it uses:
 * - useSearchParams hook (reads URL parameters)
 * - Form submission handling
 * 
 * Features:
 * - Search input field with placeholder
 * - Pre-fills with current search term (if any)
 * - Submits to server action on form submission
 * - Server action redirects to search results page
 */
const SearchInput = () => {
    // useSearchParams hook - gets URL search parameters (query string)
    // Returns a ReadonlyURLSearchParams object
    // Example: if URL is /search?term=javascript, searchParams.get("term") returns "javascript"
    const searchParams = useSearchParams();

  return (
    // HTML form element
    // action={search} - connects form submission to the search server action
    // When form submits (Enter key or button click), it calls the search server action
    // className - styling classes
    // w-full - full width
    // max-w-md - maximum width medium (28rem = 448px)
    <form action={search} className="w-full max-w-md">
      {/* Input field */}
      {/* defaultValue - initial value of the input (from URL query parameter) */}
      {/* searchParams.get("term") - gets the "term" query parameter from URL */}
      {/* || "" - if term doesn't exist, use empty string */}
      {/* type="text" - text input type */}
      {/* name="term" - form field name (used by server action via formData.get('term')) */}
      {/* placeholder - hint text shown when input is empty */}
      {/* className - additional styling (handled by Input component) */}
      <Input 
        defaultValue={searchParams.get("term") || ""} 
        type="text" 
        name="term" 
        placeholder="Search posts..." 
      />
    </form>
  );
};

// Export component so it can be imported in other files
export default SearchInput;

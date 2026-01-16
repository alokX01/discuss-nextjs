// Import React library
import React, { Suspense } from "react";

// Import AuthHeader component
// AuthHeader - displays sign in/out button based on authentication status
import AuthHeader from "./auth-header";

// Import SearchInput component
// SearchInput - search form component for searching posts
import SearchInput from "./search-input";

/**
 * Header Component (Server Component)
 * 
 * Displays the main navigation header for the application.
 * 
 * This is a Server Component - it runs on the server.
 * Server Components are good for layout components that don't need interactivity.
 * 
 * Layout:
 * - Left: Application logo/title ("Discuss")
 * - Center: Search input field
 * - Right: Authentication button (Sign In/Sign Out)
 * 
 * Features:
 * - Three-column grid layout
 * - Search functionality
 * - Authentication controls
 */
const Header = () => {
  return (
    // Main header container
    // grid - CSS Grid layout
    // grid-cols-3 - 3 equal columns
    // h-14 - fixed height (3.5rem = 56px)
    // items-center - vertically center items in grid
    // px-4 - horizontal padding (1rem = 16px)
    // border-b - bottom border (creates line separator)
    // bg-white - white background
    // sticky top-0 z-50 - makes header stick to top when scrolling, high z-index
    <div className="grid grid-cols-3 h-14 items-center px-4 border-b bg-white sticky top-0 z-50">
      {/* Left column - Logo/Title */}
      {/* flex - flexbox layout */}
      {/* justify-start - align content to the left */}
      <div className="flex justify-start">
        {/* Application title/logo */}
        {/* font-bold - bold text weight */}
        {/* text-xl - extra large text size (1.25rem = 20px) */}
        {/* text-gray-900 - dark gray text color */}
        {/* cursor-pointer - changes cursor to pointer on hover (indicates clickable) */}
        <h1 className="font-bold text-xl text-gray-900 cursor-pointer">Discuss</h1>
      </div>
      
      {/* Center column - Search */}
      {/* flex - flexbox layout */}
      {/* justify-center - align content to the center */}
      <div className="flex justify-center">
        {/* Suspense boundary - handles async component loading */}
        {/* Suspense - React component that shows fallback while child is loading */}
        {/* fallback - what to show while SearchInput is loading (empty div) */}
        {/* SearchInput uses useSearchParams which is async, so needs Suspense */}
        <Suspense fallback={<div className="w-full max-w-md h-9" />}>
          <SearchInput />
        </Suspense>
      </div>
      
      {/* Right column - Authentication */}
      {/* flex - flexbox layout */}
      {/* justify-end - align content to the right */}
      {/* gap-2 - space between items (0.5rem = 8px) */}
      <div className="flex justify-end gap-2">
        {/* AuthHeader component - shows Sign In or Sign Out button */}
        {/* This is a Client Component (uses useSession hook) */}
        <AuthHeader />
      </div>
    </div>
  );
};

// Export component so it can be imported in other files
export default Header;

// Import React and Suspense
// Suspense is required because SearchInput reads URL params asynchronously
import React, { Suspense } from "react";

// Next.js Link for client-side navigation
import Link from "next/link";

// AuthHeader handles authentication UI (sign in / sign out / profile)
import AuthHeader from "./auth-header";

// SearchInput renders the global search bar
import SearchInput from "./search-input";

/**
 * Header (Server Component)
 *
 * Responsibility:
 * - Global navigation bar
 * - Branding (Discuss)
 * - Search
 * - Auth / Profile actions
 *
 * UX Rule:
 * - Clicking "Discuss" ALWAYS goes to Home page
 */
const Header = () => {
  return (
    /*
      Header wrapper
      - Full width
      - Sticky on top
      - Clean separation from content
    */
    <header className="w-full h-14 border-b bg-white sticky top-0 z-50">
      
      {/* Inner layout container */}
      <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">

        {/* ================= LEFT: APP LOGO ================= */}
        <div className="flex items-center">
          {/* 
            Clicking logo = Home
            Industry standard behaviour
          */}
          <Link href="/">
            <h1 className="font-bold text-xl text-gray-900 cursor-pointer hover:text-gray-700 transition">
              Discuss
            </h1>
          </Link>
        </div>

        {/* ================= CENTER: SEARCH ================= */}
        <div className="flex-1 flex justify-center">
          <Suspense fallback={<div className="w-full max-w-md h-9" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* ================= RIGHT: AUTH / PROFILE ================= */}
        <div className="flex items-center gap-2">
          <AuthHeader />
        </div>

      </div>
    </header>
  );
};

export default Header;

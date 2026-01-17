"use client";

// Auth utilities
import { useSession, signIn, signOut } from "next-auth/react";

// UI
import { Button } from "@/components/ui/button";

// React
import { useState } from "react";

// Next.js navigation
import Link from "next/link";

/**
 * AuthHeader (Client Component)
 *
 * Dropdown options:
 * - Home
 * - Profile
 * - Sign out
 */
const AuthHeader = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  /**
   * User NOT logged in
   */
  if (!session || !session.user) {
    return (
      <Button onClick={() => signIn("github")}>
        Sign In
      </Button>
    );
  }

  /**
   * User logged in
   */
  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-gray-100 transition"
      >
        {session.user.image && (
          <img
            src={session.user.image}
            alt="User avatar"
            className="h-7 w-7 rounded-full"
          />
        )}

        <span className="text-sm font-medium text-gray-900">
          {session.user.name}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md overflow-hidden">

          {/* Home */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Sign out */}
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthHeader;

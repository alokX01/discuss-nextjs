"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

const AuthHeader = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session || !session.user) {
    return (
      <Button onClick={() => signIn()}>
        Sign In
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-gray-100"
      >
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Avatar"
            className="h-7 w-7 rounded-full"
          />
        )}
        <span className="text-sm font-medium">{session.user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Home
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Profile
          </Link>

          <div className="h-px bg-gray-200" />

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
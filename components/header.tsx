"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthHeader from "./auth-header";
import SearchInput from "./search-input";

const Header = () => {
  const pathname = usePathname();
  
  // Hide header on auth pages
  if (pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <header className="w-full h-14 border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
        
        {/* Logo */}
        <div>
          <Link href="/">
            <h1 className="font-bold text-xl text-gray-900 cursor-pointer hover:text-blue-600 transition">
              Discuss
            </h1>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 flex justify-center max-w-md">
          <Suspense fallback={<div className="w-full h-9 bg-gray-100 rounded animate-pulse" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Auth */}
        <div>
          <AuthHeader />
        </div>
      </div>
    </header>
  );
};

export default Header;
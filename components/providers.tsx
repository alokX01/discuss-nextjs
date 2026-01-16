// components/providers.tsx
//
// This file provides React Context providers to the entire application.
// Providers wrap the app and make context available to all components.

// "use client" directive - this is a Client Component
// Client Components run in the browser and can use React hooks
// This component needs to be a Client Component because SessionProvider is a client-side component
"use client";

// Import SessionProvider from NextAuth
// SessionProvider - React Context provider that makes session data available
// It wraps the app and provides session context to all child components
// Components can use useSession() hook to access session data
import { SessionProvider } from "next-auth/react";

/**
 * Providers Component (Client Component)
 * 
 * Wraps the application with necessary React Context providers.
 * 
 * This is a Client Component because:
 * - SessionProvider is a client-side component
 * - It uses React Context (client-side feature)
 * 
 * Features:
 * - Provides session context to all components
 * - Allows components to use useSession() hook
 * - Manages session state across the app
 * 
 * Usage:
 * - Wraps the entire app in layout.tsx
 * - All child components can access session via useSession()
 * 
 * @param children - Child components (the entire app)
 */
export default function Providers({
  children,  // children prop contains all child components
}: {
  children: React.ReactNode;  // TypeScript type for children (any React node)
}) {
  // SessionProvider - provides session context
  // All components inside can use useSession() hook to get current user session
  // This includes: user info, authentication status, etc.
  return <SessionProvider>{children}</SessionProvider>;
}

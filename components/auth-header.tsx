// "use client" directive - this is a Client Component
// Client Components run in the browser and can use React hooks
// This component needs to be a Client Component because it uses useSession hook
"use client";

// Import NextAuth React hooks and functions
// useSession - hook to get current user session (runs in browser)
// signIn - function to trigger sign in (opens OAuth provider)
// signOut - function to sign out the current user
import { useSession, signIn, signOut } from "next-auth/react";

// Import Button UI component
// Button - clickable button component from shadcn/ui
import { Button } from "@/components/ui/button";

/**
 * AuthHeader Component (Client Component)
 * 
 * Displays authentication button (Sign In or Sign Out) based on user's login status.
 * 
 * This is a Client Component because it uses:
 * - useSession hook (runs in browser to check authentication)
 * - onClick event handlers (client-side interactivity)
 * 
 * Features:
 * - Shows "Sign In" button if user is not logged in
 * - Shows "Sign Out" button if user is logged in
 * - Handles sign in/out actions
 */
const AuthHeader = () => {
  // useSession hook - gets the current user session
  // Returns object with: { data: session, status: "loading" | "authenticated" | "unauthenticated" }
  // We destructure to get just the session data
  // session - contains user info if logged in, null if not logged in
  const { data: session } = useSession();

  // Conditional rendering - check if user is logged in
  // If session exists (user is logged in)
  if (session) {
    return (
      // Sign Out button
      // Button - UI component for button
      // variant="outline" - outlined button style (border, transparent background)
      // onClick - event handler that runs when button is clicked
      // () => signOut() - arrow function that calls signOut function
      // signOut() - NextAuth function that signs out the current user
      <Button variant="outline" onClick={() => signOut()}>
        Sign Out
      </Button>
    );
  }

  // If session doesn't exist (user is not logged in)
  // Return Sign In button
  return (
    // Sign In button
    // Button - UI component for button
    // onClick - event handler that runs when button is clicked
    // () => signIn("github") - arrow function that calls signIn with "github" provider
    // signIn("github") - NextAuth function that opens GitHub OAuth login
    <Button onClick={() => signIn("github")}>
      Sign In
    </Button>
  );
};

// Export component so it can be imported in other files
export default AuthHeader;

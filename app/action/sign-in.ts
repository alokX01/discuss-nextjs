// app/action/sign-in.ts
//
// Server Action for signing in users.
// Note: This is a placeholder - actual sign in is handled by NextAuth API route.

// "use server" directive - marks this file as containing Server Actions
// Server Actions run on the server, not in the browser
"use server";

/**
 * IMPORTANT NOTE:
 * 
 * This file is a placeholder. In Next.js with NextAuth, sign in is typically
 * handled directly in Client Components using the signIn() function from next-auth/react.
 * 
 * Server Actions for sign in are not commonly used because:
 * - NextAuth handles OAuth flow in the browser
 * - OAuth requires redirects that work better client-side
 * - The signIn() function from next-auth/react is simpler
 * 
 * Current implementation:
 * - AuthHeader component uses signIn("github") directly (client-side)
 * - This is the recommended approach
 * 
 * If you need server-side sign in, you would use:
 * import { signIn } from "next-auth/react";
 * But this still requires client-side execution for OAuth.
 */

// This function is not currently used but kept for potential future use
// If you need server-side sign in logic, you can implement it here
export async function signInWithGithub() {
  // Note: signIn from next-auth/react is a client-side function
  // For server-side, you would need to use a different approach
  // This is why AuthHeader uses signIn directly in the component
  throw new Error("Use signIn() from next-auth/react in Client Components instead");
}

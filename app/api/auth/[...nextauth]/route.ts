// app/api/auth/[...nextauth]/route.ts
//
// This file is the NextAuth API route handler.
// It handles all authentication requests (sign in, sign out, callbacks, etc.)

// Import NextAuth function
// NextAuth - main function that creates the authentication handler
import NextAuth from "next-auth";

// Import authentication configuration
// authOptions - contains all NextAuth settings (providers, callbacks, etc.)
import { authOptions } from "@/lib/auth";

/**
 * NextAuth Handler
 * 
 * Creates the NextAuth handler with our configuration.
 * 
 * This handler processes:
 * - Sign in requests
 * - Sign out requests
 * - OAuth callbacks (GitHub redirects here after login)
 * - Session requests
 * - CSRF token requests
 * 
 * The [...nextauth] folder name is a catch-all route:
 * - /api/auth/signin - handled here
 * - /api/auth/signout - handled here
 * - /api/auth/callback/github - handled here
 * - /api/auth/session - handled here
 * - etc.
 */
const handler = NextAuth(authOptions);

/**
 * HTTP Method Exports
 * 
 * Next.js App Router requires explicit method exports.
 * 
 * GET - handles GET requests (session checks, OAuth callbacks)
 * POST - handles POST requests (sign in, sign out, callbacks)
 * 
 * Both use the same handler because NextAuth handles routing internally.
 */
export { handler as GET, handler as POST };

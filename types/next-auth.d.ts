// types/next-auth.d.ts
//
// TypeScript declaration file for extending NextAuth types.
// This file extends the default NextAuth Session type to include user.id.

// Import NextAuth module to extend its types
// This tells TypeScript we're modifying types from the "next-auth" package
import "next-auth";

/**
 * Module Augmentation for NextAuth
 * 
 * This extends NextAuth's default Session type to include user.id.
 * 
 * Why is this needed?
 * - By default, NextAuth's Session.user doesn't include an id field
 * - We add user.id in the session callback (lib/auth.ts)
 * - TypeScript needs to know about this custom field
 * - This file tells TypeScript that Session.user.id exists
 * 
 * How it works:
 * - declare module "next-auth" - extends the next-auth module
 * - interface Session - extends the Session interface
 * - user: { id: string } - adds id field to user object
 * 
 * Now TypeScript knows that session.user.id is available throughout the app.
 */
declare module "next-auth" {
  /**
   * Extended Session Interface
   * 
   * Adds custom fields to the default NextAuth Session type.
   */
  interface Session {
    /**
     * User object with extended properties
     * 
     * Contains:
     * - id: string (required) - User ID from database (added by us)
     * - name?: string | null (optional) - User's display name
     * - email?: string | null (optional) - User's email address
     * - image?: string | null (optional) - User's profile image URL
     */
    user: {
      id: string;              // Required: User ID (added by session callback)
      name?: string | null;    // Optional: User's display name
      email?: string | null;    // Optional: User's email address
      image?: string | null;   // Optional: User's profile image URL
    };
  }
}

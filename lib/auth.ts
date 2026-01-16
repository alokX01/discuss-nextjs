// lib/auth.ts
//
// NextAuth configuration file.
// This file contains all authentication setup and configuration.

// Import NextAuth types
// NextAuthOptions - TypeScript type for NextAuth configuration object
import type { NextAuthOptions } from "next-auth";

// Import GitHub OAuth provider
// GitHubProvider - NextAuth provider for GitHub authentication
// Users can sign in with their GitHub account
import GitHubProvider from "next-auth/providers/github";

// Import Prisma adapter for NextAuth
// PrismaAdapter - connects NextAuth to Prisma database
// This stores user sessions, accounts, and verification tokens in the database
import { PrismaAdapter } from "@auth/prisma-adapter";

// Import Prisma client instance
// prisma - database client for querying the database
import { prisma } from "@/lib";

/**
 * Environment Variables Validation
 * 
 * Check if required environment variables are set.
 * If missing, throw an error immediately (fail fast).
 * 
 * Required variables:
 * - GITHUB_CLIENT_ID - GitHub OAuth app client ID
 * - GITHUB_CLIENT_SECRET - GitHub OAuth app client secret
 * 
 * These are set in .env.local file.
 * 
 * Why check here?
 * - Prevents runtime errors later
 * - Makes it clear what's missing
 * - Fails fast during app startup
 */
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub client id or secret");
}

/**
 * NextAuth Configuration
 * 
 * This object configures NextAuth authentication.
 * It's exported and used in the API route handler.
 * 
 * Configuration includes:
 * - Database adapter (Prisma)
 * - Authentication providers (GitHub)
 * - Session callbacks (to add user ID to session)
 * - Security secret
 */
export const authOptions: NextAuthOptions = {
  /**
   * Prisma Adapter
   * 
   * Connects NextAuth to Prisma database.
   * 
   * What it does:
   * - Stores user accounts in database
   * - Stores sessions in database
   * - Stores verification tokens in database
   * - Automatically creates/updates user records
   * 
   * This replaces the need to manually manage auth data.
   */
  adapter: PrismaAdapter(prisma),

  /**
   * Authentication Providers
   * 
   * Array of authentication providers users can use to sign in.
   * Currently only GitHub is configured.
   * 
   * To add more providers:
   * - Add provider import (e.g., GoogleProvider)
   * - Add to this array with credentials
   */
  providers: [
    // GitHub OAuth provider
    GitHubProvider({
      // GitHub OAuth app client ID
      // Retrieved from environment variables
      clientId: process.env.GITHUB_CLIENT_ID as string,
      
      // GitHub OAuth app client secret
      // Retrieved from environment variables
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],

  /**
   * Callbacks
   * 
   * Functions that modify data during authentication flow.
   * 
   * session callback:
   * - Runs when session is accessed (useSession, getServerSession)
   * - Allows us to add custom data to the session object
   */
  callbacks: {
    /**
     * Session Callback
     * 
     * Modifies the session object before it's returned to the client.
     * 
     * What we do:
     * - Add user.id to session.user
     * - By default, NextAuth doesn't include user.id in session
     * - We need it for database operations (creating posts, comments, etc.)
     * 
     * @param session - Current session object
     * @param user - User object from database
     * @returns Modified session object
     */
    async session({ session, user }) {
      // Check if session.user exists
      if (session.user) {
        // Add user.id to session.user
        // @ts-ignore - TypeScript doesn't know about this property by default
        // We've extended the type in types/next-auth.d.ts
        session.user.id = user.id;
      }
      // Return the modified session
      return session;
    },
  },

  /**
   * Security Secret
   * 
   * Secret key used to encrypt session tokens.
   * 
   * Required for:
   * - Encrypting JWT tokens
   * - Signing cookies
   * - Security of authentication
   * 
   * Should be:
   * - Long random string
   * - Stored in .env.local
   * - Never committed to git
   * 
   * Generate with: openssl rand -base64 32
   */
  secret: process.env.NEXTAUTH_SECRET as string,
};

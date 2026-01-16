// lib/index.ts
// 
// This file exports the Prisma client instance.
// Prisma is an ORM (Object-Relational Mapping) tool that provides type-safe database access.

// Import PrismaClient class from Prisma
// PrismaClient is the main class that connects to the database
// It's generated from the Prisma schema (prisma/schema.prisma)
import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Instance
 * 
 * This is a singleton instance of PrismaClient.
 * We create it once and reuse it throughout the application.
 * 
 * Why a global instance?
 * - In Next.js development mode, hot reloading can create multiple instances
 * - Having multiple PrismaClient instances can exhaust database connections
 * - A single global instance prevents this issue
 * 
 * Usage:
 * - Import this in server components, server actions, and API routes
 * - Use it to query the database: prisma.post.findMany(), prisma.user.create(), etc.
 * 
 * Note: This is server-side only. Never import this in Client Components.
 */
export const prisma = new PrismaClient();

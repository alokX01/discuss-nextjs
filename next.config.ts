// next.config.ts
//
// Next.js configuration file.
// This file configures Next.js build and runtime settings.

// Import Next.js configuration type
// NextConfig - TypeScript type for Next.js configuration object
import type { NextConfig } from "next";

/**
 * Next.js Configuration Object
 * 
 * This object configures various Next.js settings.
 * 
 * Current configuration:
 * - Empty (using defaults)
 * 
 * Common configuration options you might add:
 * - images: { domains: [...] } - allowed image domains
 * - env: { ... } - environment variables
 * - experimental: { ... } - experimental features
 * - redirects: async () => [...] - URL redirects
 * - rewrites: async () => [...] - URL rewrites
 * 
 * See Next.js docs for all available options:
 * https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig: NextConfig = {
  /* config options here */
  // Add your Next.js configuration options here
  // Example:
  // images: {
  //   domains: ['example.com'],
  // },
};

// Export the configuration
// Next.js reads this file and applies the configuration
export default nextConfig;

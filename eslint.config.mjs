// eslint.config.mjs
//
// ESLint configuration file.
// ESLint is a code linting tool that finds and fixes problems in JavaScript/TypeScript code.

// Import ESLint configuration utilities
// defineConfig - helper function to define ESLint configuration
// globalIgnores - function to define files/folders to ignore
import { defineConfig, globalIgnores } from "eslint/config";

// Import Next.js ESLint configurations
// nextVitals - Next.js Core Web Vitals rules (performance, accessibility)
// nextTs - Next.js TypeScript-specific rules
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint Configuration
 * 
 * This configuration:
 * - Uses Next.js recommended rules
 * - Includes TypeScript-specific rules
 * - Ignores build/output folders
 * 
 * What ESLint does:
 * - Finds potential bugs
 * - Enforces code style
 * - Suggests best practices
 * - Can auto-fix some issues
 * 
 * Run with: npm run lint
 */
const eslintConfig = defineConfig([
  // Next.js Core Web Vitals rules
  // Checks for performance, accessibility, and best practices
  ...nextVitals,
  
  // Next.js TypeScript rules
  // TypeScript-specific linting rules
  ...nextTs,
  
  // Override default ignores
  // Files/folders that ESLint should ignore
  globalIgnores([
    // Default ignores from eslint-config-next:
    ".next/**",        // Next.js build output folder
    "out/**",         // Next.js export output folder
    "build/**",       // Build output folder
    "next-env.d.ts",  // Next.js generated type definitions
  ]),
]);

// Export the configuration
// ESLint reads this file and applies the rules
export default eslintConfig;

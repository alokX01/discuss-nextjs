// lib/utils.ts
//
// Utility functions for the application.
// This file contains helper functions used across the codebase.

// Import clsx library
// clsx - utility for constructing className strings conditionally
// It helps combine CSS class names with conditional logic
import { clsx, type ClassValue } from "clsx";

// Import twMerge from tailwind-merge
// twMerge - merges Tailwind CSS classes intelligently
// It resolves conflicts when the same utility class appears multiple times
// Example: "px-2 px-4" becomes "px-4" (last one wins)
import { twMerge } from "tailwind-merge";

/**
 * Utility Function: cn (className)
 * 
 * Combines clsx and twMerge to create a powerful className utility.
 * 
 * Features:
 * - Combines multiple class names conditionally (clsx)
 * - Resolves Tailwind class conflicts (twMerge)
 * - Handles arrays, objects, and strings
 * 
 * @param inputs - Variable number of class values (strings, arrays, objects)
 * @returns Merged and resolved className string
 * 
 * Example usage:
 * ```tsx
 * cn("px-2", "py-4") // "px-2 py-4"
 * cn("px-2", "px-4") // "px-4" (conflict resolved)
 * cn("text-red", isActive && "text-blue") // conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  // First, clsx combines all inputs into a single string
  // Then, twMerge resolves any Tailwind class conflicts
  // This ensures the final className is clean and correct
  return twMerge(clsx(inputs));
}

// postcss.config.mjs
//
// PostCSS configuration file.
// PostCSS processes CSS files and applies transformations (like Tailwind CSS).

/**
 * PostCSS Configuration Object
 * 
 * PostCSS is a tool that transforms CSS with JavaScript plugins.
 * 
 * Plugins:
 * - @tailwindcss/postcss - Tailwind CSS v4 PostCSS plugin
 *   This processes Tailwind directives (@import "tailwindcss") in CSS files
 *   and generates the final CSS with all utility classes
 * 
 * How it works:
 * 1. You write CSS with Tailwind directives in globals.css
 * 2. PostCSS processes the CSS using this plugin
 * 3. Tailwind generates utility classes
 * 4. Final CSS is output to the browser
 * 
 * This is automatically used by Next.js during the build process.
 */
const config = {
  plugins: {
    // Tailwind CSS PostCSS plugin
    // Processes @tailwindcss directives and generates utility classes
    "@tailwindcss/postcss": {},
  },
};

// Export the configuration
// PostCSS reads this file and applies the plugins
export default config;

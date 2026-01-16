// Import global CSS styles
// globals.css - contains Tailwind CSS imports and global styles
import "./globals.css";

// Import Providers component
// Providers - wraps the app with NextAuth SessionProvider
// SessionProvider provides session context to all components
import Providers from "@/components/providers";

// Import Header component
// Header - main navigation header (logo, search, auth buttons)
import Header from "@/components/header";

/**
 * RootLayout Component (Server Component)
 * 
 * This is the root layout component for the entire application.
 * All pages are wrapped by this layout.
 * 
 * This is a Server Component - it runs on the server.
 * Layout components are typically Server Components for better performance.
 * 
 * Structure:
 * - html element with lang attribute
 * - body element
 * - Providers wrapper (provides session context)
 * - Container div (centers content, max width)
 * - Header component
 * - Page content (children)
 * 
 * @param children - The page content (injected by Next.js)
 */
export default function RootLayout({
  children,  // children prop contains the page content
}: {
  children: React.ReactNode;  // TypeScript type for children (any React node)
}) {
  return (
    // HTML root element
    // lang="en" - specifies page language (English) for accessibility
    <html lang="en">
      {/* Body element - contains all visible content */}
      <body>
        {/* Providers wrapper - provides React context to child components */}
        {/* SessionProvider inside Providers gives all components access to session */}
        <Providers>
          {/* Main content container */}
          {/* container - centers content horizontally */}
          {/* mx-auto - margin left and right auto (centers the container) */}
          {/* max-w-6xl - maximum width (72rem = 1152px) - prevents content from being too wide */}
          <div className="container mx-auto max-w-6xl">
            {/* Header component - navigation bar */}
            {/* Appears at the top of every page */}
            <Header />
            
            {/* Page content */}
            {/* children - contains the actual page content (different for each route) */}
            {/* This is where Next.js injects the page component */}
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

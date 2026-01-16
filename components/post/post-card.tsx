// components/post/post-card.tsx
//
// This component displays a single post as a card.
// Note: This component exists but is not currently used in the app.
// The app uses PostList component instead, which uses Card components.

// Import Next.js Link component
// Link - client-side navigation component (faster than regular <a> tags)
import Link from "next/link";

/**
 * TypeScript Interface for Component Props
 * 
 * Defines what props PostCard expects:
 * - id: string - Unique post identifier
 * - title: string - Post title
 * - authorName: string | null - Author's name (nullable)
 */
interface PostCardProps {
  id: string;                    // Post unique ID
  title: string;                 // Post title
  authorName: string | null;     // Author's name (can be null)
}

/**
 * PostCard Component (Server Component)
 * 
 * Displays a single post as a clickable card.
 * 
 * This is a Server Component (no "use client" directive).
 * Server Components run on the server and send HTML to the browser.
 * 
 * Note: This component is not currently used in the application.
 * The app uses PostList component which renders posts differently.
 * 
 * Features:
 * - Clickable card that links to post detail page
 * - Displays post title and author
 * - Hover effects for better UX
 * 
 * @param id - Post unique ID
 * @param title - Post title
 * @param authorName - Author's name (or null)
 */
const PostCard = ({ id, title, authorName }: PostCardProps) => {
  return (
    // Link component - wraps the card for navigation
    // href - destination URL when clicked
    // Template literal builds URL: /posts/[id]
    // Note: Current app uses /topic/[slug]/posts/[id] format
    <Link href={`/posts/${id}`}>
      {/* Card container */}
      {/* border - border around the card */}
      {/* p-4 - padding inside the card (1rem = 16px) */}
      {/* rounded - rounded corners */}
      {/* hover:bg-gray-50 - background color changes to light gray on hover */}
      {/* cursor-pointer - changes cursor to pointer on hover */}
      {/* transition-colors - smooth color transition */}
      {/* shadow-sm - subtle shadow for depth */}
      <div className="border p-4 rounded hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
        {/* Post title */}
        {/* font-semibold - semi-bold font weight */}
        {/* text-lg - large text size (1.125rem = 18px) */}
        {/* text-gray-900 - dark gray text color */}
        {/* mb-2 - margin bottom (0.5rem = 8px) */}
        <h2 className="font-semibold text-lg text-gray-900 mb-2">
          {title}
        </h2>

        {/* Author name */}
        {/* text-sm - small text size (0.875rem = 14px) */}
        {/* text-gray-500 - medium gray text color */}
        {/* ?? operator - if authorName is null, use "Unknown" */}
        <p className="text-sm text-gray-500">
          by {authorName ?? "Unknown"}
        </p>
      </div>
    </Link>
  );
};

// Export component so it can be imported in other files
export default PostCard;

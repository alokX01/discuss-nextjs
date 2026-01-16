// components/topic/topic-card.tsx
//
// This component displays a single topic as a card.
// It's a clickable card that links to the topic page.

// Import Next.js Link component
// Link - client-side navigation component (faster than regular <a> tags)
// Prefetches pages on hover for better performance
import Link from "next/link";

/**
 * TypeScript Interface for Component Props
 * 
 * Defines what props TopicCard expects:
 * - slug: string - URL-friendly topic identifier (e.g., "javascript", "react")
 * - description: string - Description of what the topic is about
 */
interface TopicCardProps {
  slug: string;        // Topic slug (URL-friendly identifier)
  description: string; // Topic description
}

/**
 * TopicCard Component (Server Component)
 * 
 * Displays a single topic as a clickable card.
 * 
 * This is a Server Component (no "use client" directive).
 * Server Components run on the server and send HTML to the browser.
 * 
 * Features:
 * - Clickable card that links to topic page
 * - Displays topic slug and description
 * - Hover effects for better UX
 * - Responsive design
 * 
 * @param slug - Topic slug (URL-friendly identifier)
 * @param description - Topic description
 */
const TopicCard = ({ slug, description }: TopicCardProps) => {
  return (
    // Link component - wraps the card for navigation
    // href - destination URL when clicked
    // Template literal builds URL: /topic/[slug]
    // Example: /topic/javascript
    <Link href={`/topic/${slug}`}>
      {/* Card container */}
      {/* border - border around the card */}
      {/* border-gray-200 - light gray border color */}
      {/* p-4 - padding inside the card (1rem = 16px) */}
      {/* rounded-lg - rounded corners (large radius) */}
      {/* bg-white - white background */}
      {/* hover:bg-gray-50 - background color changes to light gray on hover */}
      {/* cursor-pointer - changes cursor to pointer on hover (indicates clickable) */}
      {/* transition-all - smooth transitions for all properties */}
      {/* shadow-sm - subtle shadow for depth */}
      {/* hover:shadow-md hover:border-gray-300 - enhanced shadow and border on hover */}
      <div className="border border-gray-200 bg-white p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-all shadow-sm hover:shadow-md hover:border-gray-300">
        {/* Topic name/title */}
        {/* font-semibold - semi-bold font weight */}
        {/* text-base - base text size (1rem = 16px) - clean and readable */}
        {/* text-gray-900 - dark gray text color */}
        {/* mb-2 - margin bottom (0.5rem = 8px) */}
        {/* capitalize - capitalizes first letter of each word */}
        {/* truncate - truncates long text with ellipsis */}
        <h2 className="font-semibold text-base text-gray-900 mb-2 capitalize truncate">
          {slug}
        </h2>

        {/* Topic description */}
        {/* text-sm - small text size (0.875rem = 14px) */}
        {/* text-gray-600 - medium gray text color */}
        {/* line-clamp-2 - limits to 2 lines with ellipsis if longer */}
        {/* leading-relaxed - increased line height for better readability */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
};

// Export component so it can be imported in other files
export default TopicCard;

// components/topic/topic-card.tsx
//
// This component renders a single discussion topic as a clickable card.
// It is used inside TopicList (sidebar / topic navigation).

// Next.js Link for client-side navigation
// Faster than normal <a> tag and supports prefetching
import Link from "next/link";

/**
 * Props definition for TopicCard
 *
 * slug        → URL-friendly topic name (used in route)
 * description → Short explanation of the topic
 */
type TopicCardProps = {
  slug: string;
  description: string;
};

/**
 * TopicCard (Server Component)
 *
 * Responsibility:
 * - Show one topic
 * - Navigate user to topic page
 *
 * Why Server Component?
 * - No state
 * - No event handlers
 * - Pure UI rendering
 */
const TopicCard = ({ slug, description }: TopicCardProps) => {
  return (
    // Entire card is clickable
    <Link href={`/topic/${slug}`} className="block">
      <div
        className="
          rounded-md
          border
          bg-white
          px-3
          py-2
          transition
          hover:bg-gray-50
          hover:border-gray-300
        "
      >
        {/* Topic title */}
        <p className="text-sm font-medium text-gray-900 capitalize">
          {slug}
        </p>

        {/* Topic description */}
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default TopicCard;

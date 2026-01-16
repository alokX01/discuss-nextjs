// components/topic/topic-list.tsx
//
// This component displays a list of all topics.
// It fetches topics from the database and renders them as cards.

// Import Prisma client instance
// prisma - database client for querying the database
import { prisma } from "@/lib";

// Import TopicCard component
// TopicCard - component that displays a single topic as a card
import TopicCard from "./topic-card";

/**
 * TopicList Component (Server Component)
 * 
 * Displays a list of all discussion topics.
 * 
 * This is an async Server Component - it can fetch data directly from the database.
 * Server Components run on the server and send HTML to the browser (better performance).
 * 
 * Features:
 * - Fetches all topics from database
 * - Displays topics in a grid layout
 * - Shows empty state if no topics exist
 * - Each topic is a clickable card
 * 
 * Flow:
 * 1. Fetch all topics from database
 * 2. Check if any topics exist
 * 3. Render topics as cards in a grid
 */
const TopicList = async () => {
  // Fetch all topics from the database
  // findMany() - gets all records from the Topic table
  // await - waits for the async database query to complete
  // No where clause means it gets ALL topics
  const topics = await prisma.topic.findMany({
    // Optional: order topics by creation date (newest first)
    orderBy: {
      createdAt: "desc"  // Sort by creation date, descending
    }
  });

  // Check if no topics exist in the database
  if (topics.length === 0) {
    // Return empty state message
    return (
      // Empty state container
      // border border-dashed - dashed border (indicates empty state)
      // border-gray-300 - light gray border color
      // rounded-lg - rounded corners (large radius)
      // p-8 - padding (2rem = 32px)
      // text-center - center align text
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
        {/* Empty state message */}
        {/* text-sm - small text size */}
        {/* text-gray-500 - medium gray text color */}
        <p className="text-sm text-gray-500">
          No topics found in database.
        </p>
        {/* Helper text */}
        <p className="text-xs text-gray-400 mt-2">
          Create a new topic to get started!
        </p>
      </div>
    );
  }

  return (
    // Flex container for topics
    // flex flex-col - flexbox layout, vertical direction (stack items)
    // gap-3 - space between items (0.75rem = 12px) - cleaner spacing
    <div className="flex flex-col gap-3">
      {/* Map over topics array to render each topic */}
      {/* topics.map() - creates a new array by transforming each topic into JSX */}
      {topics.map((topic) => (
        // TopicCard component - displays a single topic
        // key={topic.id} - React requires unique key for list items (for performance)
        // topic.id - unique identifier from database
        <TopicCard
          key={topic.id}
          // slug - topic slug (URL-friendly identifier)
          slug={topic.slug}
          // description - topic description
          description={topic.description}
        />
      ))}
    </div>
  );
};

// Export component so it can be imported in other files
export default TopicList;

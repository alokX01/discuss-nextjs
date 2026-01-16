// Import PostList component
// PostList - displays a list of posts in card format
import PostList from "@/components/posts/post-list";

// Import PostCreateForm component
// PostCreateForm - form component for creating new posts in a topic
import PostCreateForm from "@/components/posts/post-create-form";

// Import query function to fetch posts by topic
// fetchPostByTopicSlug - fetches all posts for a specific topic
import { fetchPostByTopicSlug } from "@/lib/query/post";

// Import Prisma client instance
// Prisma is an ORM for type-safe database operations
import { prisma } from "@/lib";

// Import NextAuth function for server-side session retrieval
// getServerSession - gets the user session on the server
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains our authentication setup
import { authOptions } from "@/lib/auth";

// Import Next.js navigation redirect function
// redirect - sends user to a different URL
import { redirect } from "next/navigation";

// Import React library
import React from "react";

/**
 * TypeScript Type for Page Props
 * 
 * Next.js App Router pages receive params as a prop.
 * In Next.js 15+, params is a Promise that must be awaited.
 * 
 * params - URL route parameters (from [slug] folder name)
 * - slug: string - the topic slug from the URL (e.g., "javascript" from /topic/javascript)
 */
type TopicShowPageProps = {
  params: Promise<{ slug: string }>;  // Promise containing URL route parameters
};

/**
 * Topic Show Page Component (Server Component)
 * 
 * Displays a topic page with its posts and a form to create new posts.
 * 
 * This is an async Server Component - it can fetch data directly from the database.
 * Server Components run on the server and send HTML to the browser (better performance).
 * 
 * URL format: /topic/[slug] (e.g., /topic/javascript)
 * 
 * Layout:
 * - Left side (3 columns): Topic info and post list
 * - Right side (1 column): Post creation form
 * 
 * Features:
 * - Displays topic slug and description
 * - Shows all posts in the topic
 * - Allows users to create new posts
 * - Handles topic not found scenario
 * 
 * @param params - URL route parameters (contains slug)
 */
const TopicShowPage: React.FC<TopicShowPageProps> = async ({ params }) => {
  // Get the current user's session from the server
  // This checks if the user is logged in
  const session = await getServerSession(authOptions);

  // Check if user is NOT authenticated
  // If not logged in, redirect to home page
  if (!session || !session.user) {
    redirect("/");
  }

  // Await the params Promise to get the actual parameters
  // In Next.js 15+, params is async and must be awaited
  const { slug } = await params;

  // Fetch the topic from the database
  // findUnique - finds a single record by unique field (slug)
  // await - waits for the async database query to complete
  const topic = await prisma.topic.findUnique({
    // where - filter condition (find topic with this slug)
    where: { slug },  // Shorthand for: where: { slug: slug }
  });

  // Check if topic was not found
  if (!topic) {
    // Return error message if topic doesn't exist
    return (
      <div className="p-4">
        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 font-medium">Topic not found</p>
        </div>
      </div>
    );
  }

  return (
    // Main container with grid layout
    // grid - CSS Grid layout
    // grid-cols-4 - 4 equal columns
    // gap-4 - space between grid items (1rem = 16px)
    // p-4 - padding on all sides (1rem = 16px)
    <div className="grid grid-cols-4 gap-4 p-4">
      {/* Left section - takes 3 out of 4 columns (75% width) */}
      {/* col-span-3 - spans 3 columns */}
      <div className="col-span-3">
        {/* Topic title section */}
        <div className="mb-4">
            {/* Topic badge/tag */}
            {/* inline-block - makes element inline but allows width/height */}
            {/* bg-blue-600 - solid blue background (gradient not needed for small badge) */}
            {/* text-white - white text color */}
            {/* px-4 py-2 - horizontal and vertical padding */}
            {/* rounded-full - fully rounded (pill shape) */}
            {/* text-sm - small text size */}
            {/* font-semibold - semi-bold font weight */}
            {/* mb-3 - margin bottom */}
            {/* shadow-sm - subtle shadow for depth */}
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3 shadow-sm">
                {slug}
            </span>
            
            {/* Topic title */}
            {/* font-bold - bold text weight */}
            {/* text-3xl - 3x large text size (1.875rem = 30px) */}
            {/* mb-2 - margin bottom (0.5rem = 8px) */}
            {/* text-gray-900 - dark gray text color */}
            <h1 className="font-bold text-3xl mb-2 text-gray-900 capitalize">{slug}</h1>
        </div>
        
        {/* Topic description */}
        {/* text-gray-600 - medium gray text color */}
        {/* mb-4 - margin bottom (1rem = 16px) */}
        <p className="text-gray-600 mb-4">{topic.description}</p>
        
        {/* PostList component - displays all posts in this topic */}
        {/* fetchData={() => fetchPostByTopicSlug(slug)} - passes a function that fetches posts */}
        {/* Arrow function creates a function that calls fetchPostByTopicSlug with the slug */}
        {/* PostList will call this function to get the posts to display */}
        <PostList fetchData={() => fetchPostByTopicSlug(slug)}/>
      </div>
      
      {/* Right section - takes 1 out of 4 columns (25% width) */}
      {/* Sidebar with post creation form */}
      <div>
        {/* PostCreateForm component - allows users to create new posts */}
        {/* slug={slug} - passes the topic slug to the form */}
        {/* The form will create a post in this topic */}
        <PostCreateForm slug={slug}/>
      </div>
    </div>
  );
};

// Export component as default export
export default TopicShowPage;

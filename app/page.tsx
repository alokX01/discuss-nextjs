// Import PostList component
// PostList - displays a list of posts in card format
import PostList from "@/components/posts/post-list";

// Import TopicCreateForm component
// TopicCreateForm - form component for creating new discussion topics
import TopicCreateForm from "@/components/topic/topic-create-form";

// Import TopicList component
// TopicList - displays a list of all topics
import TopicList from "@/components/topic/topic-list";

// Import query function to fetch top posts
// fetchTopPosts - fetches the top 5 posts ordered by comment count
import { fetchTopPosts } from "@/lib/query/post";

// Import NextAuth function for server-side session retrieval
// getServerSession - gets the user session on the server
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains our authentication setup
import { authOptions } from "@/lib/auth";

// Import Next.js navigation redirect function
// redirect - sends user to a different URL
import { redirect } from "next/navigation";

/**
 * Home Page Component (Server Component)
 * 
 * This is the main/home page of the application.
 * 
 * This is an async Server Component - it can fetch data directly from the database.
 * Server Components run on the server and send HTML to the browser (better performance).
 * 
 * Authentication:
 * - Users must be logged in to view posts
 * - If not logged in, they see a message to sign in
 * 
 * Layout:
 * - Left side (3 columns): Displays top posts
 * - Right side (1 column): Displays topic creation form and topic list
 * 
 * Features:
 * - Shows top 5 posts (most commented)
 * - Shows list of all topics
 * - Allows users to create new topics
 * - Responsive grid layout
 */
export default async function Home() {
  // Get the current user's session from the server
  // This checks if the user is logged in
  const session = await getServerSession(authOptions);

  // Check if user is NOT authenticated
  // If not logged in, show a message encouraging them to sign in
  if (!session || !session.user) {
    return (
      // Main container with centered content
      // min-h-screen - minimum height of viewport
      // flex - flexbox layout
      // items-center - vertically center content
      // justify-center - horizontally center content
      // bg-gradient-to-br from-blue-50 to-indigo-100 - gradient background
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        {/* Sign in prompt card */}
        {/* max-w-md - maximum width medium */}
        {/* bg-white - white background */}
        {/* rounded-lg - rounded corners */}
        {/* shadow-xl - large shadow for depth */}
        {/* p-8 - padding (2rem = 32px) */}
        {/* text-center - center align text */}
        <div className="max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Welcome message */}
          {/* text-3xl - extra large text */}
          {/* font-bold - bold text weight */}
          {/* text-gray-900 - dark gray text */}
          {/* mb-4 - margin bottom */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Discuss
          </h1>
          
          {/* Description */}
          {/* text-gray-600 - medium gray text */}
          {/* mb-6 - margin bottom */}
          <p className="text-gray-600 mb-6">
            Please sign in with GitHub to view and create posts, topics, and join discussions.
          </p>
          
          {/* Sign in button */}
          {/* This will be handled by the AuthHeader component in the header */}
          {/* But we can also add a direct link here */}
          <a 
            href="/api/auth/signin"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In with GitHub
          </a>
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
      {/* Left section - takes 3 out of 4 columns */}
      {/* col-span-3 - spans 3 columns (75% width) */}
      <div className="col-span-3">
        {/* Page heading */}
        {/* text-2xl - 2x large text size (1.5rem = 24px) */}
        {/* font-bold - bold text weight */}
        {/* mb-4 - margin bottom (1rem = 16px) */}
        {/* text-gray-900 - dark gray text color */}
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Top Posts</h1>
        
        {/* PostList component */}
        {/* fetchData={fetchTopPosts} - passes the function to fetch top posts */}
        {/* PostList will call this function to get the posts to display */}
        <PostList fetchData={fetchTopPosts}/>
      </div>
      
      {/* Right section - takes 1 out of 4 columns */}
      {/* Sidebar with topic creation form and topic list */}
      <div className="space-y-4">
        {/* TopicCreateForm component */}
        {/* Allows users to create new discussion topics */}
        {/* Opens in a dialog/modal when clicked */}
        <div className="mb-6">
          <TopicCreateForm/>
        </div>
        
        {/* Topic list section */}
        {/* Shows all available topics */}
        <div>
          {/* Section heading */}
          {/* text-xl - extra large text */}
          {/* font-bold - bold text weight */}
          {/* mb-4 - margin bottom */}
          {/* text-gray-900 - dark gray text */}
          <h2 className="text-xl font-bold mb-4 text-gray-900">All Topics</h2>
          
          {/* TopicList component */}
          {/* Displays all topics as clickable cards */}
          <TopicList/>
        </div>
      </div>
    </div>
  );
}

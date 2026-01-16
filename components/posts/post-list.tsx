// Import React library
// React is needed even though we're not using JSX features directly
// It's required for TypeScript to understand React components
import React from 'react';

// Import Card UI components from shadcn/ui
// Card - container component with border and shadow
// CardHeader - header section of the card
// CardTitle - title text in the card
// CardDescription - description/subtitle text in the card
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

// Import TypeScript type for posts with related data
// PostWithData - type that includes post data plus topic, comment count, and user info
import { PostWithData } from '@/lib/query/post';

// Import Next.js Link component
// Link - client-side navigation component (faster than regular <a> tags)
// Prefetches pages on hover for better performance
import Link from 'next/link';

/**
 * TypeScript Type for Component Props
 * 
 * Defines what props PostList expects:
 * - fetchData: A function that returns a Promise of PostWithData array
 * 
 * This is a function prop pattern - the parent component passes a function
 * that fetches the data. This makes PostList flexible (can fetch different data).
 */
type PostListProps = {
    fetchData: () => Promise<PostWithData[]>  // Function that fetches posts
}

/**
 * PostList Component (Server Component)
 * 
 * Displays a list of posts in card format.
 * 
 * This is an async Server Component - it can fetch data directly from the database.
 * Server Components run on the server and send HTML to the browser (no JavaScript needed).
 * 
 * Features:
 * - Displays posts as clickable cards
 * - Shows post title, author, and comment count
 * - Handles empty state (no posts)
 * - Uses the fetchData prop to get posts (flexible data source)
 * 
 * @param fetchData - Function that fetches the posts to display
 */
const PostList : React.FC<PostListProps> = async ({fetchData}) => {
    // Call the fetchData function to get posts
    // await - waits for the async operation to complete
    // This runs on the server, so it can directly access the database
    const posts = await fetchData();
    
    // Check if there are no posts
    // Only show empty state if posts array is actually empty (length === 0)
    if (!posts || posts.length === 0) {
        // Return empty state message
        // This is shown when there are no posts to display
        return (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <p className="text-gray-500 text-lg font-medium">No posts yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to create a post!</p>
            </div>
        );
    }

  return (
    // Container div for the post list
    // flex flex-col - flexbox layout, vertical direction (stack items)
    // gap-3 - space between items (0.75rem = 12px) - better spacing
    <div className='flex flex-col gap-3'>
        {
            // Map over posts array to render each post
            // posts.map() - creates a new array by transforming each post into JSX
            posts.map((post) => (
                // Link component wraps each card for navigation
                // key={post.id} - React requires unique key for list items (for performance)
                // href - destination URL when clicked
                // Template literal builds URL: /topic/[slug]/posts/[postId]
                // Example: /topic/javascript/posts/abc123
                <Link key={post.id} href={`/topic/${post.topic.slug}/posts/${post.id}`}>
                    {/* Card component - displays post information */}
                    {/* className - additional styling */}
                    {/* bg-white - white background */}
                    {/* hover:bg-gray-50 - background color changes on hover */}
                    {/* cursor-pointer - changes cursor to pointer on hover */}
                    {/* transition-all - smooth transitions for all properties */}
                    {/* hover:shadow-md - enhanced shadow on hover for depth */}
                    {/* border-gray-200 hover:border-gray-300 - border color changes on hover */}
                    <Card className="bg-white hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md border-gray-200 hover:border-gray-300">
                        {/* Card header section */}
                        <CardHeader>
                            {/* Post title */}
                            {/* CardTitle - styled title text */}
                            {/* text-gray-900 - dark gray text color */}
                            {/* hover:text-blue-600 - blue text on hover */}
                            {/* transition-colors - smooth color transition */}
                            {/* mb-1 - margin bottom (0.25rem = 4px) */}
                            <CardTitle className="text-gray-900 hover:text-blue-600 transition-colors mb-1">
                                {post.title}
                            </CardTitle>
                            
                            {/* Card description section with metadata */}
                            {/* flex items-center justify-between - flexbox layout */}
                            {/* items-center - vertically center items */}
                            {/* justify-between - space items apart (author on left, count on right) */}
                            {/* mt-2 - margin top (0.5rem = 8px) */}
                            <CardDescription className='flex items-center justify-between mt-2'>
                                {/* Author name */}
                                {/* post.user.name || 'Anonymous' - use name or default to "Anonymous" */}
                                {/* || operator - if left side is falsy, use right side */}
                                {/* text-gray-600 - medium gray text color */}
                                {/* font-medium - medium font weight */}
                                <span className="text-gray-600 font-medium text-sm">
                                    By {post.user.name || 'Anonymous'}
                                </span>
                                
                                {/* Comment count with icon-like styling */}
                                {/* post._count.comments - number of comments (from Prisma _count) */}
                                {/* text-gray-500 - lighter gray text color */}
                                {/* text-sm - small text size */}
                                {/* bg-gray-100 - light gray background */}
                                {/* px-2 py-1 - padding */}
                                {/* rounded-full - fully rounded (pill shape) */}
                                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
                                </span>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))
        }
    </div>
  );
}

// Export component so it can be imported in other files
export default PostList;

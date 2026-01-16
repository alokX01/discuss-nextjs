// Import Prisma client instance
// Prisma is an ORM for type-safe database operations
import { prisma } from "@/lib";

// Import NextAuth function for server-side session retrieval
// getServerSession - gets the user session on the server
import { getServerSession } from "next-auth";

// Import NextAuth configuration
// authOptions contains our authentication setup
import { authOptions } from "@/lib/auth";

// Import PostEditForm component
// PostEditForm - form component for editing posts
import PostEditForm from "./post-edit-form";

// Import PostDeleteButton component
// PostDeleteButton - button component for deleting posts
import PostDeleteButton from "./post-delete-button";

/**
 * TypeScript Type for Component Props
 * 
 * Defines what props PostShow expects:
 * - postId: string - The ID of the post to display
 */
type PostShowProps = {
    postId: string;  // The post ID to fetch and display
};

/**
 * PostShow Component (Server Component)
 * 
 * Displays a single post with its details.
 * 
 * This is an async Server Component - it can fetch data directly from the database.
 * Server Components run on the server and send HTML to the browser (better performance).
 * 
 * Features:
 * - Fetches post data from database
 * - Displays post title, content, author, and creation date
 * - Shows topic information
 * - Handles post not found scenario
 * 
 * @param postId - The ID of the post to display
 */
const PostShow = async ({ postId }: PostShowProps) => {
    // Get the current user's session from the server
    // This is used to check if user can edit/delete this post
    const session = await getServerSession(authOptions);
    
    // Fetch the post from the database with related data
    // findUnique - finds a single record by unique field (id)
    // await - waits for the async database query to complete
    const post = await prisma.post.findUnique({
        // where - filter condition (find post with this id)
        where: { id: postId },
        // include - include related data in the results
        include: {
            // user - include the author/user information
            user: {
                // select - specify which fields to include (only name and image)
                select: {
                    name: true,   // Author's name
                    image: true   // Author's profile image URL
                }
            },
            // topic - include the topic information
            topic: {
                // select - specify which fields to include (slug and description)
                select: {
                    slug: true,        // Topic slug for building URLs
                    description: true  // Topic description
                }
            }
        }
    });
    
    // Check if post was not found
    if (!post) {
        // Return message if post doesn't exist
        return (
            <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                <p className="text-red-600 font-medium">Post not found</p>
            </div>
        );
    }
    
    // Check if user is the owner of this post
    // Only the post owner can edit/delete
    // session?.user?.id - current user's ID (if logged in)
    // post.userId - post owner's ID
    const isOwner = session?.user?.id === post.userId;

    // Format the creation date for display
    // toLocaleDateString - converts date to readable format (e.g., "1/15/2024")
    // Options object - specifies how to format the date
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',    // Include year (e.g., 2024)
        month: 'long',      // Full month name (e.g., January)
        day: 'numeric',     // Day of month (e.g., 15)
        hour: '2-digit',    // Hour in 2 digits (e.g., 02)
        minute: '2-digit'   // Minute in 2 digits (e.g., 30)
    });

    return (
        // Main container for the post
        // border - adds border around the container
        // rounded-lg - rounded corners (large radius)
        // shadow-sm - subtle shadow for depth
        // bg-white - white background
        // p-6 - padding on all sides (1.5rem = 24px)
        <div className="border rounded-lg shadow-sm bg-white p-6">
            {/* Post header section */}
            {/* mb-4 - margin bottom (1rem = 16px) */}
            <div className="mb-4">
                {/* Post title and actions row */}
                {/* flex - flexbox layout */}
                {/* justify-between - space items apart (title on left, actions on right) */}
                {/* items-start - align items to top */}
                {/* gap-4 - space between items */}
                <div className="flex justify-between items-start gap-4 mb-2">
                    {/* Post title */}
                    {/* flex-1 - takes up remaining space */}
                    {/* text-3xl - extra large text size (1.875rem = 30px) */}
                    {/* font-bold - bold text weight */}
                    {/* text-gray-900 - dark gray text color */}
                    <h1 className="text-3xl font-bold text-gray-900 flex-1">
                        {post.title}
                    </h1>
                    
                    {/* Edit/Delete buttons - only show if user is the owner */}
                    {/* Conditional rendering - only render if isOwner is true */}
                    {isOwner && (
                        // Actions container
                        // flex - flexbox layout
                        // gap-2 - space between buttons
                        <div className="flex gap-2">
                            {/* PostEditForm component - allows editing the post */}
                            <PostEditForm 
                                postId={post.id} 
                                slug={post.topic.slug} 
                                title={post.title} 
                                content={post.content} 
                            />
                            
                            {/* PostDeleteButton component - allows deleting the post */}
                            <PostDeleteButton 
                                postId={post.id} 
                                slug={post.topic.slug} 
                            />
                        </div>
                    )}
                </div>
                
                {/* Post metadata (author and date) */}
                {/* flex - flexbox layout */}
                {/* items-center - vertically center items */}
                {/* gap-4 - space between items (1rem = 16px) */}
                {/* text-sm - small text size */}
                {/* text-gray-500 - medium gray text color */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    {/* Author name */}
                    {/* post.user.name || 'Anonymous' - use name or default to "Anonymous" */}
                    {/* || operator - if left side is falsy, use right side */}
                    <span>By <span className="font-medium text-gray-700">{post.user.name || 'Anonymous'}</span></span>
                    
                    {/* Separator dot */}
                    <span>•</span>
                    
                    {/* Creation date */}
                    <span>{formattedDate}</span>
                </div>
            </div>
            
            {/* Topic badge */}
            {/* inline-block - makes element inline but allows width/height */}
            {/* bg-blue-100 - light blue background */}
            {/* text-blue-800 - dark blue text */}
            {/* px-3 py-1 - horizontal and vertical padding */}
            {/* rounded-full - fully rounded (pill shape) */}
            {/* text-sm - small text size */}
            {/* mb-4 - margin bottom */}
            <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.topic.slug}
                </span>
            </div>
            
            {/* Post content */}
            {/* text-gray-800 - dark gray text color */}
            {/* leading-relaxed - increased line height for readability */}
            {/* whitespace-pre-wrap - preserves line breaks and wraps text */}
            {/* This allows multi-line content to display properly */}
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {post.content}
            </div>
        </div>
    );
};

// Export component so it can be imported in other files
export default PostShow;

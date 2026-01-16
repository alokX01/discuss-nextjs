// Import TypeScript type from Prisma generated types
// Post type represents a post record from the database
// This gives us type safety when working with post data
import type { Post } from "@prisma/client";

// Import Prisma client instance
// ".." means go up one directory (from lib/query to lib)
// prisma is the database client that lets us query the database
import { prisma } from "..";

/**
 * TypeScript Type: PostWithData
 * 
 * This is an extended type that includes additional data with a Post.
 * It uses TypeScript's intersection type (&) to combine types.
 * 
 * Contains:
 * - All fields from Post (id, title, content, userId, topicId, createdAt, etc.)
 * - topic: Object with slug field (for building URLs)
 * - _count: Object with comments count (Prisma's count feature)
 * - user: Object with name field (author information)
 * 
 * This type represents a post with all related data needed for display
 */
export type PostWithData = Post & {
    topic: { slug: string };              // Topic slug for building URLs (e.g., "javascript")
    _count: { comments: number }          // Count of comments on this post (Prisma feature)
    user: { name: string | null }         // Author name (nullable because user might not have name)
}

/**
 * Query Function: fetchPostByTopicSlug
 * 
 * Fetches all posts belonging to a specific topic.
 * 
 * Uses Prisma to query the database:
 * - Filters posts by topic slug
 * - Includes related data (topic, comment count, user)
 * - Orders by creation date (newest first)
 * 
 * @param slug - The topic slug (URL-friendly identifier, e.g., "javascript")
 * @returns Promise<PostWithData[]> - Array of posts with related data
 */
export const fetchPostByTopicSlug = async (slug: string): Promise<PostWithData[]> => {
    // Prisma query: find many posts matching the criteria
    return prisma.post.findMany({
        // where - filter condition (only posts in this topic)
        where: {
            // topic: { slug } - nested condition
            // This finds posts where the related topic has this slug
            // Prisma automatically joins the Topic table
            topic: { slug }  // Shorthand for: topic: { slug: slug }
        },
        // include - include related data in the results
        include: {
            // topic: { select: { slug: true } } - include topic, but only the slug field
            // This gives us the slug needed to build URLs
            topic: { select: { slug: true } },
            
            // _count: { select: { comments: true } } - include comment count
            // _count is a Prisma feature that counts related records
            // This gives us the number of comments without loading all comments
            _count: { select: { comments: true } },
            
            // user: { select: { name: true } } - include user, but only the name field
            // This gives us the author's name for display
            user: { select: { name: true } }
        },
        // orderBy - sort the results
        orderBy: {
            createdAt: "desc"  // Sort by creation date, descending (newest first)
        }
    });
}

/**
 * Query Function: fetchTopPosts
 * 
 * Fetches the top 5 posts ordered by number of comments.
 * Used on the homepage to show most discussed posts.
 * 
 * Uses Prisma to:
 * - Order posts by comment count (descending)
 * - Include related data (topic, comment count, user)
 * - Limit results to 5 posts (take: 5)
 * 
 * @returns Promise<PostWithData[]> - Array of top 5 posts with related data
 */
export const fetchTopPosts = async (): Promise<PostWithData[]> => {
    // Prisma query: find many posts, ordered by comment count
    // First, get all posts with their comment counts
    const posts = await prisma.post.findMany({
        // include - include related data
        include: {
            // Include topic slug for building URLs
            topic: { select: { slug: true } },
            
            // Include comment count (needed for sorting and display)
            _count: { select: { comments: true } },
            
            // Include author name
            user: { select: { name: true } }
        }
    });
    
    // Sort posts by comment count (descending) and creation date (newest first)
    // This ensures posts with most comments appear first
    // If comment counts are equal, newer posts appear first
    const sortedPosts = posts.sort((a, b) => {
        // First, sort by comment count (descending)
        const commentDiff = b._count.comments - a._count.comments;
        if (commentDiff !== 0) {
            return commentDiff;
        }
        // If comment counts are equal, sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Return top 5 posts
    return sortedPosts.slice(0, 5);
}

/**
 * Query Function: fetchPostBySearch
 * 
 * Searches for posts by title or content.
 * Uses Prisma's OR condition to search both fields.
 * 
 * @param term - The search term to look for
 * @returns Promise<PostWithData[]> - Array of matching posts with related data
 */
export const fetchPostBySearch = async (term: string): Promise<PostWithData[]> => {
    // Prisma query: find many posts matching search criteria
    return prisma.post.findMany({
        // include - include related data
        include: {
            // Include topic slug for building URLs
            topic: { select: { slug: true } },
            
            // Include comment count
            _count: { select: { comments: true } },
            
            // Include author name
            user: { select: { name: true } }
        },
        // where - filter condition (search criteria)
        where: {
            // OR - matches if ANY of the conditions are true
            OR: [
                // { title: { contains: term } } - search in title field
                // contains - case-sensitive partial match (SQL LIKE)
                // Example: term="react" matches "React Native" or "Introduction to React"
                { title: { contains: term } },
                
                // { content: { contains: term } } - search in content field
                // Searches the post body/content
                { content: { contains: term } }
            ]
            // A post matches if the term appears in EITHER title OR content
        },
        // orderBy - sort the results
        orderBy: {
            createdAt: "desc"  // Sort by creation date, descending (newest first)
        }
    });
}

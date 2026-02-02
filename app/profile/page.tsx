import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Fetch user's posts
  const myPosts = await prisma.post.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      topic: {
        select: { slug: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch user's comments
  const myComments = await prisma.comment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          topic: {
            select: { slug: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white rounded-lg border p-8">
        <div className="flex items-start gap-6">
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-200"
            />
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{session.user.name || "Anonymous User"}</h1>
            <p className="text-gray-600">{session.user.email}</p>
            
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-semibold text-lg">{myPosts.length}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold text-lg">{myComments.length}</span>
                <span className="text-gray-600 ml-1">Comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Posts</h2>
        
        {myPosts.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
            <p>You haven't created any posts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <Link
                key={post.id}
                href={`/topic/${post.topic.slug}/posts/${post.id}`}
                className="block"
              >
                <Card className="hover:bg-gray-50 transition">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">{post.title}</CardTitle>
                    <CardDescription className="flex justify-between text-xs">
                      <span>in #{post.topic.slug}</span>
                      <span>{post._count.comments} comments</span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Comments */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Comments</h2>
        
        {myComments.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
            <p>You haven't commented yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myComments.map((comment) => (
              <Link
                key={comment.id}
                href={`/topic/${comment.post.topic.slug}/posts/${comment.post.id}`}
                className="block"
              >
                <Card className="hover:bg-gray-50 transition">
                  <CardHeader>
                    <CardDescription className="text-sm text-gray-600 mb-1">
                      On: {comment.post.title}
                    </CardDescription>
                    <div className="text-sm text-gray-800 line-clamp-2">
                      {comment.content}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// app/profile/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib";
import PostList from "@/components/posts/post-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Profile Page
 * - Shows user info
 * - Shows user's own posts
 */
const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  // Fetch only logged-in user's posts
  const fetchMyPosts = async () => {
    return prisma.post.findMany({
      where: { userId: session.user.id },
      include: {
        topic: { select: { slug: true } },
        _count: { select: { comments: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* ================= PROFILE HEADER ================= */}
      <div className="flex items-center gap-6 border rounded-lg bg-white p-6">
        {/* Avatar */}
        <Avatar className="h-16 w-16">
          <AvatarImage src={session.user.image || ""} />
          <AvatarFallback>
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {session.user.name || "My Profile"}
          </h1>
          <p className="text-sm text-gray-500">
            {session.user.email}
          </p>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="border-b flex gap-6 text-sm font-medium text-gray-600">
        <span className="border-b-2 border-black pb-2 text-black">
          Posts
        </span>
        <span className="pb-2 cursor-not-allowed opacity-50">
          Comments (soon)
        </span>
      </div>

      {/* ================= POSTS ================= */}
      <div>
        <PostList fetchData={fetchMyPosts} />
      </div>
    </div>
  );
};

export default ProfilePage;

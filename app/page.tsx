// app/page.tsx

import PostList from "@/components/posts/post-list";
import TopicCreateForm from "@/components/topic/topic-create-form";
import TopicList from "@/components/topic/topic-list";
import { fetchTopPosts } from "@/lib/query/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // -----------------------------
  // GUEST VIEW (not logged in)
  // -----------------------------
  if (!session || !session.user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Welcome to Discuss
          </h1>

          <p className="mb-6 text-gray-600">
            A place to share ideas, ask questions, and discuss different topics
            with people.
          </p>

          <a
            href="/api/auth/signin"
            className="inline-block rounded-md bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800 transition"
          >
            Sign in with GitHub
          </a>
        </div>
      </div>
    );
  }

  // -----------------------------
  // AUTHENTICATED VIEW
  // -----------------------------
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      
      {/* ================= LEFT: POSTS ================= */}
      <section className="lg:col-span-3">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Top Discussions
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Most active conversations happening right now
          </p>
        </div>

        <PostList fetchData={fetchTopPosts} />
      </section>

      {/* ================= RIGHT: SIDEBAR ================= */}
      <aside className="space-y-6">
        
        {/* Create Topic */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Create a Topic
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            Topics are categories where discussions live
          </p>
          <TopicCreateForm />
        </div>

        {/* Topics List */}
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Browse Topics
          </h2>
          <TopicList />
        </div>
      </aside>
    </div>
  );
}

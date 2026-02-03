

import { Suspense } from "react";
import TopicList from "@/components/topic/topic-list";
import TopicCreateForm from "@/components/topic/topic-create-form";
import PostList from "@/components/posts/post-list";
import { fetchTopPosts } from "@/lib/query/post";


export default function HomePage() {
  console.log("HomePage");
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-4">Top Discussions</h2>
          <Suspense fallback={<div className="text-gray-500">Loading posts...</div>}>
            <PostList fetchData={fetchTopPosts} />
          </Suspense>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Create Topic</h3>
            <TopicCreateForm />
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-3">Topics</h3>
            <Suspense fallback={<div className="text-gray-400 text-sm">Loading...</div>}>
              <TopicList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

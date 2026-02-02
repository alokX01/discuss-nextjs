import PostList from "@/components/posts/post-list";
import { fetchPostBySearch } from "@/lib/query/post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type SearchPageProps = {
  searchParams: Promise<{ term?: string }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const term = params.term || "";

  if (!term) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg border p-8 text-center">
          <h1 className="text-xl font-bold mb-2">Search Posts</h1>
          <p className="text-gray-500">Enter a search term to find posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600">
          Results for: <span className="font-medium text-blue-600">"{term}"</span>
        </p>
      </div>
      <PostList fetchData={() => fetchPostBySearch(term)} />
    </div>
  );
};

export default SearchPage;
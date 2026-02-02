import { prisma } from "@/lib/prisma";
import TopicCard from "./topic-card";

const TopicList = async () => {
  const topics = await prisma.topic.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (topics.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-sm text-gray-500">No topics found</p>
        <p className="text-xs text-gray-400 mt-2">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {topics.map((topic) => (
        <TopicCard key={topic.id} slug={topic.slug} description={topic.description} />
      ))}
    </div>
  );
};

export default TopicList;
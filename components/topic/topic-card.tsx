import Link from "next/link";

type TopicCardProps = {
  slug: string;
  description: string;
};

const TopicCard = ({ slug, description }: TopicCardProps) => {
  return (
    <Link href={`/topic/${slug}`} className="block">
      <div className="rounded-md border bg-white px-3 py-2 hover:bg-gray-50">
        <p className="text-sm font-medium text-gray-900 capitalize">{slug}</p>
        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
};

export default TopicCard;
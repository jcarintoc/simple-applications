import { PostForm } from "@/components/posts/PostForm";
import { PostList } from "@/components/posts/PostList";
import { useFeed } from "@/lib/query/posts";

export function FeedPage() {
  const { data, isLoading } = useFeed();

  return (
    <div>
      <div className="border border-border px-4 py-3">
        <PostForm />
      </div>
      <PostList posts={data?.posts || []} isLoading={isLoading} />
    </div>
  );
}

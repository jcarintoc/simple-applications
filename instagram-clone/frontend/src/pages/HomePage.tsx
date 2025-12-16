import { PostCard } from "@/components/posts";
import { useFeed } from "@/lib/query/posts";
import { useUser } from "@/lib/query";
import { StoriesPage } from "./StoriesPage";

export function HomePage() {
  const { data: posts, isLoading } = useFeed();
  const { data: userData } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-muted-foreground">Loading feed...</p>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Please log in to view your feed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      <StoriesPage />
      <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
      <div className="space-y-0">
        {!posts || posts.length === 0 ? (
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Your feed is empty.</p>
              <p className="text-sm text-muted-foreground">
                Follow users to see their posts here!
              </p>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} showComments={true} />
          ))
        )}
      </div>
    </div>
  );
}

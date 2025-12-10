import { PostsList } from "@/components/posts";
import { useGetAllPosts } from "@/lib/query";

export function PostsListPage() {
  const { data: posts, isLoading, error } = useGetAllPosts();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-destructive">
          Error loading posts: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="mt-1 text-muted-foreground">
              Discover and read interesting articles
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <PostsList posts={posts || []} emptyMessage="No posts published yet" />
      </div>
    </div>
  );
}

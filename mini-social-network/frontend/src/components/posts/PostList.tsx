import { PostCard } from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post } from "@/lib/api/posts";

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
}

export function PostList({ posts, isLoading }: PostListProps) {
  if (isLoading) {
    return (
      <div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b px-4 py-3">
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 border-b">
        <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="border-x border-b border-t-0">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

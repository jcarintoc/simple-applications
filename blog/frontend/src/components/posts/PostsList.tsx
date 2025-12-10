import { PostCard } from "./PostCard";
import type { PostWithAuthor } from "@/lib/api";

interface PostsListProps {
  posts: PostWithAuthor[];
  emptyMessage?: string;
}

export const PostsList = ({ posts, emptyMessage = "No posts found" }: PostsListProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

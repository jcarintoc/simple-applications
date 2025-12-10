import { PostCard } from "./PostCard";
import type { PostWithAuthor } from "@/lib/api";

interface PostsListProps {
  posts: PostWithAuthor[];
  emptyMessage?: string;
}

export const PostsList = ({ posts, emptyMessage = "No posts found" }: PostsListProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <span className="text-4xl">✍️</span>
        </div>
        <h3 className="text-xl font-serif font-medium mb-2">No stories yet</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const [featuredPost, ...otherPosts] = posts;

  return (
    <div className="space-y-16">
      {/* Featured Post Section */}
      <section>
        <PostCard post={featuredPost} featured={true} />
      </section>

      {/* Recent Posts Grid */}
      {otherPosts.length > 0 && (
        <section>
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium tracking-widest uppercase text-black">Recent Stories</h3>
            <div className="h-px flex-1 bg-black"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

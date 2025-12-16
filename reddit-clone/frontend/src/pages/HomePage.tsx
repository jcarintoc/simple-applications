import { Link } from "react-router-dom";
import { PostCard } from "@/components/posts";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/lib/query/posts";
import { useSubreddits } from "@/lib/query/subreddits";
import { useUser } from "@/lib/query";
import { PlusCircle } from "lucide-react";

export function HomePage() {
  const { data: posts, isLoading } = usePosts();
  const { data: subreddits } = useSubreddits();
  const { data: userData } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">All Posts</h1>
            {userData?.user && (
              <Button asChild>
                <Link to="/submit">
                  <PlusCircle className="h-4 w-4" />
                  Create Post
                </Link>
              </Button>
            )}
          </div>

          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No posts yet.</p>
              {userData?.user && (
                <Button asChild>
                  <Link to="/submit">Create the first post</Link>
                </Button>
              )}
            </div>
          )}
        </main>

        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-muted rounded-lg p-4">
              <h2 className="font-bold text-lg mb-4">Subreddits</h2>
              {subreddits && subreddits.length > 0 ? (
                <div className="space-y-2">
                  {subreddits.slice(0, 10).map((subreddit) => (
                    <Link
                      key={subreddit.id}
                      to={`/r/${subreddit.name}`}
                      className="block text-sm hover:text-primary"
                    >
                      r/{subreddit.name}
                    </Link>
                  ))}
                  {subreddits.length > 10 && (
                    <Link
                      to="/subreddits"
                      className="block text-sm text-primary font-medium mt-2"
                    >
                      View all →
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subreddits yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

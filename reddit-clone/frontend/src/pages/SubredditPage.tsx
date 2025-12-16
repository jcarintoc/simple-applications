import { useParams, Link } from "react-router-dom";
import { PostCard } from "@/components/posts";
import { Button } from "@/components/ui/button";
import { useSubreddits } from "@/lib/query/subreddits";
import { usePosts } from "@/lib/query/posts";
import { useUser } from "@/lib/query";
import { PlusCircle } from "lucide-react";

export function SubredditPage() {
  const { name } = useParams<{ name: string }>();
  const { data: userData } = useUser();

  // Find subreddit by name from the list
  const { data: allSubreddits, isLoading: isLoadingSubreddits } = useSubreddits();
  const subreddit = allSubreddits?.find((s) => s.name === name);

  const { data: posts, isLoading: isLoadingPosts } = usePosts(subreddit?.id);

  if (isLoadingSubreddits) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading subreddit...</p>
      </div>
    );
  }

  if (!subreddit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Subreddit not found</p>
      </div>
    );
  }

  if (isLoadingPosts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">r/{subreddit.name}</h1>
        <p className="text-muted-foreground mb-4">{subreddit.description}</p>
        {userData?.user && (
          <Button asChild>
            <Link to={`/r/${subreddit.name}/submit`}>
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
          <p className="text-muted-foreground mb-4">No posts in this subreddit yet.</p>
          {userData?.user && (
            <Button asChild>
              <Link to={`/r/${subreddit.name}/submit`}>Create the first post</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

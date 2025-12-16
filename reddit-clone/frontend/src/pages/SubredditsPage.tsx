import { Link } from "react-router-dom";
import { SubredditCard } from "@/components/subreddits";
import { Button } from "@/components/ui/button";
import { useSubreddits } from "@/lib/query/subreddits";
import { useUser } from "@/lib/query";
import { PlusCircle } from "lucide-react";

export function SubredditsPage() {
  const { data: subreddits, isLoading } = useSubreddits();
  const { data: userData } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading subreddits...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subreddits</h1>
          <p className="text-muted-foreground">Browse all communities</p>
        </div>
        {userData?.user && (
          <Button asChild>
            <Link to="/subreddits/create">
              <PlusCircle className="h-4 w-4" />
              Create Subreddit
            </Link>
          </Button>
        )}
      </div>

      {subreddits && subreddits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subreddits.map((subreddit) => (
            <SubredditCard key={subreddit.id} subreddit={subreddit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No subreddits yet.</p>
          {userData?.user && (
            <Button asChild>
              <Link to="/subreddits/create">Create the first subreddit</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

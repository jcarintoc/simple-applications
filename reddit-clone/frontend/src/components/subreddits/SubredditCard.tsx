import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubredditWithCreator } from "@/lib/api/types";

interface SubredditCardProps {
  subreddit: SubredditWithCreator;
}

export function SubredditCard({ subreddit }: SubredditCardProps) {
  return (
    <Link to={`/r/${subreddit.name}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">r/{subreddit.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{subreddit.description}</p>
          <p className="text-xs text-muted-foreground">Created by {subreddit.creator_name}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

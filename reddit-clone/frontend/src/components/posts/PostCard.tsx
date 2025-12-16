import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButton } from "./VoteButton";
import type { PostWithAuthor } from "@/lib/api/types";
import { useUser } from "@/lib/query";
import { useUpvotePost } from "@/lib/query/posts";

interface PostCardProps {
  post: PostWithAuthor;
  showVote?: boolean;
}

export function PostCard({ post, showVote = true }: PostCardProps) {
  const { data: userData } = useUser();
  const upvoteMutation = useUpvotePost();

  // For simplicity, we'll check if user voted by trying to upvote and checking the response
  // In a real app, you'd want the backend to return hasVoted in the post object
  const handleVote = () => {
    if (userData?.user) {
      upvoteMutation.mutate(post.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        {showVote && (
          <div className="flex-shrink-0">
            <VoteButton
              upvotes={post.upvotes}
              hasVoted={false}
              onVote={handleVote}
              disabled={!userData?.user || upvoteMutation.isPending}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Link to={`/posts/${post.id}`} className="block">
            <CardHeader className="p-0 pb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>r/{post.subreddit_name}</span>
                <span>•</span>
                <span>Posted by {post.author_name}</span>
              </div>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
            </CardContent>
          </Link>
        </div>
      </div>
    </Card>
  );
}

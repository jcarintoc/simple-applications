import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import { useComments } from "@/lib/query/comments";

interface CommentListProps {
  videoId: number;
}

const CommentListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="animate-pulse flex gap-3">
        <div className="w-8 h-8 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-3 bg-muted rounded w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

const CommentList = ({ videoId }: CommentListProps) => {
  const { data: comments, isLoading } = useComments(videoId);

  return (
    <div className="space-y-4">
      <CommentForm videoId={videoId} />

      {isLoading ? (
        <CommentListSkeleton />
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} videoId={videoId} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentList;

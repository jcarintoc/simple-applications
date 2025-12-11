import { MessageCircle } from "lucide-react";
import { CommentCard } from "./CommentCard";
import { CommentForm } from "./CommentForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useComments } from "@/lib/query/comments";

interface CommentListProps {
  postId: number;
}

export function CommentList({ postId }: CommentListProps) {
  const { data, isLoading } = useComments(postId);

  return (
    <div>
      <CommentForm postId={postId} />

      {isLoading ? (
        <div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border-b px-4 py-3">
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      ) : data?.comments.length === 0 ? (
        <div className="text-center py-12 border-b">
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="p-0 space-y-3">
          <div className="inline-flex items-center gap-2">
            <MessageCircle className="size-4"/>
            <p>Comments</p>
          </div>

          {data?.comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

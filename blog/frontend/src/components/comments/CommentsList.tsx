import { CommentItem } from "./CommentItem";
import { Separator } from "../ui/separator";
import type { CommentWithAuthor } from "@/lib/api";
import { MessageSquare } from "lucide-react";

interface CommentsListProps {
  comments: CommentWithAuthor[];
  onDeleteComment?: (id: number) => void;
  deletingCommentId?: number;
}

export const CommentsList = ({ comments, onDeleteComment, deletingCommentId }: CommentsListProps) => {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>
      </div>
      <Separator />
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={onDeleteComment}
            isDeleting={deletingCommentId === comment.id}
          />
        ))}
      </div>
    </div>
  );
};

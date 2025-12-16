import type { CommentWithAuthor } from "@/lib/api/types";

interface CommentListProps {
  comments: CommentWithAuthor[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author_name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

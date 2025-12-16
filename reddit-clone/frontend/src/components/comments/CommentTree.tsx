import { CommentItem } from "./CommentItem";
import { buildCommentTree } from "@/lib/utils/comments";
import type { CommentWithAuthor } from "@/lib/api/types";

interface CommentTreeProps {
  comments: CommentWithAuthor[];
  postId: number;
}

export function CommentTree({ comments, postId }: CommentTreeProps) {
  const tree = buildCommentTree(comments);

  if (tree.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tree.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/users/UserAvatar";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import { useDeleteComment } from "@/lib/query/comments";
import { useUser } from "@/lib/query";
import type { Comment } from "@/lib/api/comments";
import { Link } from "react-router-dom";

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  const { data: userData } = useUser();
  const deleteMutation = useDeleteComment();

  const isOwner = userData?.user.id === comment.user_id;

  const handleDelete = () => {
    deleteMutation.mutate({ commentId: comment.id, postId: comment.post_id });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className="px-4 py-3 hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        <Link to={`/users/${comment.user_id}`} className="shrink-0">
          <UserAvatar name={comment.user_name} className="h-8 w-8" />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              <Link
                to={`/users/${comment.user_id}`}
                className="font-bold text-sm hover:underline"
              >
                {comment.user_name}
              </Link>
              <span className="text-muted-foreground text-sm">@{comment.user_username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">
                {formatDate(comment.created_at)}
              </span>
            </div>
            {isOwner && (
              <DeleteConfirmDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
                title="Delete comment?"
                description="This can't be undone and it will be removed from this post."
                onConfirm={handleDelete}
                disabled={deleteMutation.isPending}
              />
            )}
          </div>

          <p className="text-[15px] whitespace-pre-wrap mt-1">{comment.content}</p>
        </div>
      </div>
    </article>
  );
}

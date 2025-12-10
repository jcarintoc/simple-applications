import { Trash2, User, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import type { CommentWithAuthor } from "@/lib/api";
import { useUser } from "@/lib/query";

interface CommentItemProps {
  comment: CommentWithAuthor;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export const CommentItem = ({ comment, onDelete, isDeleting }: CommentItemProps) => {
  const { data } = useUser();
  const isAuthor = data?.user?.id === comment.author_id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">{comment.author_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(comment.created_at)}</span>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{comment.content}</p>
          </div>
          {isAuthor && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

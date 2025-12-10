import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import type { CommentWithAuthor } from "@/lib/api";
import { useUser } from "@/lib/query";

interface CommentItemProps {
  comment: CommentWithAuthor;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export const CommentItem = ({
  comment,
  onDelete,
  isDeleting,
}: CommentItemProps) => {
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
    <Card className="m-0 gap-0 border-none p-4 shadow-none">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex items-center justify-center p-2 w-10 h-10 rounded-full bg-blue-100">
                <p className="text-lg font-medium text-black">
                  {comment.author_name.charAt(0).toUpperCase()}
                </p>
              </div>
              {/* Author Name and created at */}
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">
                  {comment.author_name}
                </span>
                <span className="text-xs">
                  {formatDate(comment.created_at)}
                </span>
              </div>
            </div>

            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {comment.content}
            </p>
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

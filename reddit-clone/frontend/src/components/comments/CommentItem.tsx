import { useState } from "react";
import { VoteButton } from "@/components/posts/VoteButton";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";
import { useUser } from "@/lib/query";
import { useUpvoteComment, useDeleteComment, useUpdateComment, useCreateComment } from "@/lib/query/comments";
import type { CommentWithAuthor } from "@/lib/api/types";
import type { CommentWithChildren } from "@/lib/utils/comments";
import { MessageSquare, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentItemProps {
  comment: CommentWithChildren;
  postId: number;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const { data: userData } = useUser();
  const upvoteMutation = useUpvoteComment();
  const deleteMutation = useDeleteComment();
  const updateMutation = useUpdateComment();
  const createCommentMutation = useCreateComment();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOwner = userData?.user?.id === comment.user_id;

  const handleVote = () => {
    if (userData?.user) {
      upvoteMutation.mutate(comment.id);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(comment.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handleEdit = (data: { content: string }) => {
    updateMutation.mutate(
      { id: comment.id, data },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <VoteButton
            upvotes={comment.upvotes}
            hasVoted={false}
            onVote={handleVote}
            disabled={!userData?.user || upvoteMutation.isPending}
            size="sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="font-medium">{comment.author_name}</span>
              <span className="text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            {isEditing ? (
              <CommentForm
                postId={postId}
                parentId={comment.parent_id}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                defaultValues={{ content: comment.content }}
                isLoading={updateMutation.isPending}
              />
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  {userData?.user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReplying(!isReplying)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Reply
                    </Button>
                  )}
                  {isOwner && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {isReplying && (
            <div className="mt-2 ml-4">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSubmit={(data) => {
                  createCommentMutation.mutate(
                    { postId, data },
                    {
                      onSuccess: () => {
                        setIsReplying(false);
                      },
                    }
                  );
                }}
                onCancel={() => setIsReplying(false)}
                isLoading={createCommentMutation.isPending}
              />
            </div>
          )}

          {comment.children.length > 0 && (
            <div className="mt-2 ml-4 space-y-2 border-l-2 border-muted pl-4">
              {comment.children.map((child) => (
                <CommentItem key={child.id} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

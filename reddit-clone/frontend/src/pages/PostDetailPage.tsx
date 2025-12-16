import { useParams, Link } from "react-router-dom";
import { usePost } from "@/lib/query/posts";
import { CommentTree, CommentForm } from "@/components/comments";
import { useComments, useCreateComment } from "@/lib/query/comments";
import { VoteButton } from "@/components/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/query";
import { useUpvotePost, useDeletePost } from "@/lib/query/posts";
import { Trash2 } from "lucide-react";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  const { data: post, isLoading: isLoadingPost } = usePost(postId);
  const { data: comments, isLoading: isLoadingComments } = useComments(postId);
  const { data: userData } = useUser();
  const upvoteMutation = useUpvotePost();
  const deleteMutation = useDeletePost();
  const createCommentMutation = useCreateComment();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOwner = userData?.user?.id === post?.user_id;

  const handleVote = () => {
    if (userData?.user && post) {
      upvoteMutation.mutate(post.id);
    }
  };

  const handleDelete = () => {
    if (post) {
      deleteMutation.mutate(post.id, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  const handleCommentSubmit = (data: { content: string; parent_id?: number | null }) => {
    createCommentMutation.mutate(
      { postId, data },
      {
        onSuccess: () => {
          // Form resets automatically
        },
      }
    );
  };

  if (isLoadingPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">Post not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <div className="flex gap-4 p-6">
          <div className="flex-shrink-0">
            <VoteButton
              upvotes={post.upvotes}
              hasVoted={false}
              onVote={handleVote}
              disabled={!userData?.user || upvoteMutation.isPending}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardHeader className="p-0 pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link to={`/r/${post.subreddit_name}`} className="hover:text-primary">
                  r/{post.subreddit_name}
                </Link>
                <span>•</span>
                <span>Posted by {post.author_name}</span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-4">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            {isOwner && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {userData?.user ? (
          <div className="mb-6">
            <CommentForm
              postId={postId}
              onSubmit={handleCommentSubmit}
              isLoading={createCommentMutation.isPending}
            />
          </div>
        ) : (
          <div className="mb-6 p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground mb-2">Please log in to comment</p>
            <Button asChild variant="outline">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        )}

        {isLoadingComments ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : comments ? (
          <CommentTree comments={comments} postId={postId} />
        ) : null}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
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

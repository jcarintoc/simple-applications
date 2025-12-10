import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentForm, CommentsList } from "@/components/comments";
import {
  useGetPostBySlug,
  useGetCommentsByPostId,
  useCreateComment,
  useDeleteComment,
  useDeletePost,
  useUser,
} from "@/lib/query";
import { ArrowLeft, Calendar, User, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CreateCommentInput } from "@/lib/api";

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: userData } = useUser();
  const user = userData?.user;

  const { data: post, isLoading: postLoading } = useGetPostBySlug(slug!);
  const { data: comments = [], isLoading: commentsLoading } =
    useGetCommentsByPostId(post?.id || 0);

  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const deletePostMutation = useDeletePost();

  const isAuthor = user?.id === post?.author_id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCommentSubmit = (data: CreateCommentInput) => {
    if (!post) return;

    createCommentMutation.mutate(
      { postId: post.id, input: data },
      {
        onSuccess: () => {
          toast.success("Comment posted successfully!");
        },
        onError: () => {
          toast.error("Failed to post comment. Please try again.");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (!post) return;

    deleteCommentMutation.mutate(
      { id: commentId, postId: post.id },
      {
        onSuccess: () => {
          toast.success("Comment deleted successfully!");
        },
        onError: () => {
          toast.error("Failed to delete comment. Please try again.");
        },
      }
    );
  };

  const handleDeletePost = () => {
    if (!post || !confirm("Are you sure you want to delete this post?")) return;

    deletePostMutation.mutate(post.id, {
      onSuccess: () => {
        toast.success("Post deleted successfully!");
        navigate("/posts");
      },
      onError: () => {
        toast.error("Failed to delete post. Please try again.");
      },
    });
  };

  if (postLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <Button asChild className="mt-4">
            <Link to="/posts">Back to Posts</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-8">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h1 className="text-4xl font-bold leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    {post.published ? (
                      <Badge variant="default">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                </div>
                {isAuthor && (
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeletePost}
                      disabled={deletePostMutation.isPending}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {post.content}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {commentsLoading ? (
                <div className="text-center text-muted-foreground">
                  Loading comments...
                </div>
              ) : (
                <CommentsList
                  comments={comments}
                  onDeleteComment={handleDeleteComment}
                  deletingCommentId={
                    deleteCommentMutation.isPending
                      ? deleteCommentMutation.variables?.id
                      : undefined
                  }
                />
              )}

              {user ? (
                <CommentForm
                  onSubmit={handleCommentSubmit}
                  isSubmitting={createCommentMutation.isPending}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Please log in to comment</p>
                  <Button asChild className="mt-4">
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/users/UserAvatar";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import { useLikePost, useUnlikePost } from "@/lib/query/likes";
import { useDeletePost } from "@/lib/query/posts";
import { useUser } from "@/lib/query";
import type { Post } from "@/lib/api/posts";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
  showActions?: boolean;
}

export function PostCard({ post, showActions = true }: PostCardProps) {
  const { data: userData } = useUser();
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const deleteMutation = useDeletePost();

  const isOwner = userData?.user.id === post.user_id;
  const isLiked = post.isLiked || false;

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikeMutation.mutate(post.id);
    } else {
      likeMutation.mutate(post.id);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
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
    <article className=" px-4 py-3 hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        <Link to={`/users/${post.user_id}`} className="shrink-0">
          <UserAvatar name={post.user_name} className="h-10 w-10" />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              <Link
                to={`/users/${post.user_id}`}
                className="font-bold hover:underline"
              >
                {post.user_name}
              </Link>
              <span className="text-muted-foreground">@{post.user_username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">
                {formatDate(post.created_at)}
              </span>
            </div>
            {isOwner && showActions && (
              <DeleteConfirmDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
                title="Delete post?"
                description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
                onConfirm={handleDelete}
                disabled={deleteMutation.isPending}
              />
            )}
          </div>

          <Link to={`/posts/${post.id}`} className="block">
            <p className="whitespace-pre-wrap text-[15px] mt-1">{post.content}</p>
          </Link>

          {showActions && (
            <div className="flex items-center gap-1 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeToggle}
                disabled={likeMutation.isPending || unlikeMutation.isPending}
                className={`h-8 px-2 hover:bg-pink-500/10 hover:text-pink-600 group ${
                  isLiked ? "text-pink-600" : "text-muted-foreground"
                }`}
              >
                <Heart
                  className={`h-[18px] w-[18px] transition-colors ${
                    isLiked ? "fill-pink-600" : ""
                  }`}
                />
                <span className="text-sm">
                  {post.likeCount > 0 ? post.likeCount : ""}
                </span>
              </Button>

              <Link to={`/posts/${post.id}`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 hover:bg-blue-500/10 hover:text-blue-600 group text-muted-foreground"
                >
                  <MessageCircle className="h-[18px] w-[18px]" />
                  <span className="text-sm">
                    {post.commentCount > 0 ? post.commentCount : ""}
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

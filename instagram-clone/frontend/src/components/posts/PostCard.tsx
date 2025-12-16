import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LikeButton } from "./LikeButton";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import type { PostWithAuthor, CommentWithAuthor } from "@/lib/api/types";
import { useUser } from "@/lib/query";
import { useLikePost } from "@/lib/query/posts";
import { useComments, useCreateComment } from "@/lib/query/comments";
import { useState } from "react";

interface PostCardProps {
  post: PostWithAuthor;
  showComments?: boolean;
}

export function PostCard({ post, showComments = false }: PostCardProps) {
  const { data: userData } = useUser();
  const likeMutation = useLikePost();
  const { data: comments } = useComments(post.id);
  const createCommentMutation = useCreateComment();
  const [hasLiked, setHasLiked] = useState(false); // In a real app, get this from backend

  const handleLike = () => {
    if (userData?.user) {
      likeMutation.mutate(post.id, {
        onSuccess: (data) => {
          setHasLiked(data.hasLiked);
        },
      });
    }
  };

  const handleCommentSubmit = (data: { content: string }) => {
    createCommentMutation.mutate(
      { postId: post.id, data },
      {
        onSuccess: () => {
          // Form resets automatically
        },
      }
    );
  };

  return (
    <Card className="mb-6 p-0 gap-0">
      {/* Post Header */}
      <div className="p-4 border-b">
        <Link
          to={`/profile/${post.user_id}`}
          className="flex items-center gap-3"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
            {post.author_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{post.author_name}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        </Link>
      </div>

      {/* Post Image */}
      <img
        src={post.image_url}
        alt={post.caption || "Post image"}
        className="w-full aspect-square object-cover"
      />

      <div className="space-y-3">
        {/* Post Caption */}
        {post.caption && (
          <div className="px-4 pt-4">
            <span className="font-semibold mr-2">{post.author_name}</span>
            <span className="text-sm">{post.caption}</span>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center gap-4 px-4">
          <LikeButton
            likesCount={post.likes_count}
            hasLiked={hasLiked}
            onLike={handleLike}
            disabled={!userData?.user || likeMutation.isPending}
          />
        </div>

        {/* Comments Section */}
        {showComments && comments && comments.length > 0 && (
          <div>
            <CommentList comments={comments} />
          </div>
        )}

        {/* Comment Form */}
        {userData?.user && (
          <CommentForm
            onSubmit={handleCommentSubmit}
            isLoading={createCommentMutation.isPending}
          />
        )}
      </div>
    </Card>
  );
}

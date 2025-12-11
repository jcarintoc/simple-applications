import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/posts/PostCard";
import { CommentList } from "@/components/comments/CommentList";
import { usePost } from "@/lib/query/posts";

export function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const postIdNum = parseInt(postId || "0");
  const navigate = useNavigate();

  const { data, isLoading, error } = usePost(postIdNum);

  if (isLoading) {
    return (
      <div>
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur px-4 py-3">
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-48 w-full border-b" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      <PostCard post={data.post} />

      <CommentList postId={postIdNum} />
    </div>
  );
}

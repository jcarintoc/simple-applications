import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/posts";
import { useGetPostById, useUpdatePost, useUser } from "@/lib/query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CreatePostInput } from "@/lib/api";

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: userData } = useUser();
  const user = userData?.user;

  const { data: post, isLoading } = useGetPostById(Number(id));
  const updatePostMutation = useUpdatePost();

  const isAuthor = user?.id === post?.author_id;

  const handleSubmit = (data: CreatePostInput) => {
    if (!post) return;

    updatePostMutation.mutate(
      { id: post.id, input: data },
      {
        onSuccess: () => {
          toast.success("Post updated successfully!");
          navigate(`/posts/${post.slug}`);
        },
        onError: (error) => {
          toast.error("Failed to update post. Please try again.");
          console.error(error);
        },
      }
    );
  };

  const handleCancel = () => {
    if (post) {
      navigate(`/posts/${post.slug}`);
    } else {
      navigate("/posts");
    }
  };

  if (isLoading) {
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

  if (!isAuthor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to edit this post
          </p>
          <Button asChild className="mt-4">
            <Link to={`/posts/${post.slug}`}>Back to Post</Link>
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
            <Link to={`/posts/${post.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Post
            </Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Post</CardTitle>
              <CardDescription>
                Make changes to your post. Your changes will be saved when you
                click update.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostForm
                initialData={{
                  title: post.title,
                  content: post.content,
                  published: post.published,
                }}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={updatePostMutation.isPending}
                submitLabel="Update Post"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

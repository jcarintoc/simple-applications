import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostForm } from "@/components/posts";
import { useCreatePost } from "@/lib/query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CreatePostInput } from "@/lib/api";

export function CreatePostPage() {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const handleSubmit = (data: CreatePostInput) => {
    createPostMutation.mutate(data, {
      onSuccess: (post) => {
        toast.success("Post created successfully!");
        navigate(`/posts/${post.slug}`);
      },
      onError: (error) => {
        toast.error("Failed to create post. Please try again.");
        console.error(error);
      },
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

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
            <CardHeader>
              <CardTitle className="text-2xl">Create New Post</CardTitle>
              <CardDescription>
                Write a new blog post. You can save it as a draft or publish it
                immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={createPostMutation.isPending}
                submitLabel="Create Post"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

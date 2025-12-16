import { useNavigate } from "react-router-dom";
import { CreatePostForm } from "@/components/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePost } from "@/lib/query/posts";

export function CreatePostPage() {
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const handleSubmit = (data: { image_url: string; caption?: string | null }) => {
    createPostMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create Post</h1>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePostForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            isLoading={createPostMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

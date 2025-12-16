import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "@/components/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePost } from "@/lib/query/posts";
import { useSubreddits } from "@/lib/query/subreddits";

export function CreatePostPage() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const createPostMutation = useCreatePost();
  const { data: subreddits } = useSubreddits();

  // If name is provided, find the subreddit
  const subreddit = name ? subreddits?.find((s) => s.name === name) : undefined;

  const handleSubmit = (data: { subreddit_id: number; title: string; content: string }) => {
    createPostMutation.mutate(data, {
      onSuccess: (post) => {
        navigate(`/posts/${post.id}`);
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
          <PostForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            isLoading={createPostMutation.isPending}
            defaultSubredditId={subreddit?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}

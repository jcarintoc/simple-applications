import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateSubreddit } from "@/lib/query/subreddits";
import { createSubredditInputSchema, type CreateSubredditInput } from "@/lib/api/types";

export function CreateSubredditPage() {
  const navigate = useNavigate();
  const createSubredditMutation = useCreateSubreddit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubredditInput>({
    resolver: zodResolver(createSubredditInputSchema),
  });

  const onSubmit = (data: CreateSubredditInput) => {
    createSubredditMutation.mutate(data, {
      onSuccess: (subreddit) => {
        navigate(`/r/${subreddit.name}`);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create Subreddit</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subreddit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
                placeholder="e.g., programming"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Alphanumeric with underscores only, minimum 3 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
                placeholder="Describe your subreddit..."
                rows={5}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createSubredditMutation.isPending}>
                {createSubredditMutation.isPending ? "Creating..." : "Create Subreddit"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

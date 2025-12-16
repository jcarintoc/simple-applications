import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createPostInputSchema, type CreatePostInput } from "@/lib/api/types";
import { useSubreddits } from "@/lib/query/subreddits";

interface PostFormProps {
  onSubmit: (data: CreatePostInput) => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreatePostInput>;
  isLoading?: boolean;
  defaultSubredditId?: number;
}

export function PostForm({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading,
  defaultSubredditId,
}: PostFormProps) {
  const { data: subreddits } = useSubreddits();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostInputSchema),
    defaultValues: {
      ...defaultValues,
      subreddit_id: defaultSubredditId || defaultValues?.subreddit_id,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subreddit_id">Subreddit *</Label>
        <select
          id="subreddit_id"
          {...register("subreddit_id", { valueAsNumber: true })}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.subreddit_id ? "border-destructive" : ""
          }`}
        >
          <option value="">Select a subreddit</option>
          {subreddits?.map((subreddit) => (
            <option key={subreddit.id} value={subreddit.id}>
              r/{subreddit.name}
            </option>
          ))}
        </select>
        {errors.subreddit_id && (
          <p className="text-sm text-destructive">{errors.subreddit_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register("title")}
          className={errors.title ? "border-destructive" : ""}
          placeholder="Post title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          {...register("content")}
          className={errors.content ? "border-destructive" : ""}
          placeholder="Post content"
          rows={8}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Posting..." : "Post"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

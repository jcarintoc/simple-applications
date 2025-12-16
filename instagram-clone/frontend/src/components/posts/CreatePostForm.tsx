import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createPostInputSchema, type CreatePostInput } from "@/lib/api/types";

interface CreatePostFormProps {
  onSubmit: (data: CreatePostInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function CreatePostForm({ onSubmit, onCancel, isLoading }: CreatePostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostInputSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL *</Label>
        <Input
          id="image_url"
          {...register("image_url")}
          className={errors.image_url ? "border-destructive" : ""}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image_url && (
          <p className="text-sm text-destructive">{errors.image_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          {...register("caption")}
          className={errors.caption ? "border-destructive" : ""}
          placeholder="Write a caption..."
          rows={4}
        />
        {errors.caption && (
          <p className="text-sm text-destructive">{errors.caption.message}</p>
        )}
        <p className="text-xs text-muted-foreground">Max 2000 characters</p>
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCommentInputSchema, type CreateCommentInput } from "@/lib/api/types";

interface CommentFormProps {
  postId: number;
  parentId?: number | null;
  onSubmit: (data: CreateCommentInput) => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateCommentInput>;
  isLoading?: boolean;
}

export function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  defaultValues,
  isLoading,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentInputSchema),
    defaultValues: {
      ...defaultValues,
      parent_id: parentId,
    },
  });

  const handleFormSubmit = (data: CreateCommentInput) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Your comment</Label>
        <Textarea
          id="content"
          {...register("content")}
          className={errors.content ? "border-destructive" : ""}
          placeholder={parentId ? "Write a reply..." : "What are your thoughts?"}
          rows={4}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Posting..." : "Comment"}
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCommentInputSchema, type CreateCommentInput } from "@/lib/api/types";

interface CommentFormProps {
  onSubmit: (data: CreateCommentInput) => void;
  isLoading?: boolean;
}

export function CommentForm({ onSubmit, isLoading }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentInputSchema),
  });

  const handleFormSubmit = (data: CreateCommentInput) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="border-t p-4">
      <div className="flex gap-2">
        <Input
          {...register("content")}
          placeholder="Add a comment..."
          className={errors.content ? "border-destructive" : ""}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
      {errors.content && (
        <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
      )}
    </form>
  );
}

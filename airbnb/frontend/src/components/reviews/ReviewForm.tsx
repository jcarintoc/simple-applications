import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/lib/query/reviews";
import { createReviewInputSchema, type CreateReviewInput } from "@/lib/api/types";
import { StarRatingInput } from "./StarRating";

interface ReviewFormProps {
  propertyId: number;
  onSuccess?: () => void;
}

export function ReviewForm({ propertyId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const createReviewMutation = useCreateReview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewInputSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = (data: CreateReviewInput) => {
    createReviewMutation.mutate(
      { propertyId, data: { ...data, rating } },
      {
        onSuccess: () => {
          reset();
          setRating(5);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Rating</label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="comment" className="text-sm font-medium mb-2 block">
          Comment
        </label>
        <Textarea
          id="comment"
          {...register("comment")}
          placeholder="Share your experience..."
          className={errors.comment ? "border-destructive" : ""}
        />
        {errors.comment && (
          <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" disabled={createReviewMutation.isPending}>
        {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

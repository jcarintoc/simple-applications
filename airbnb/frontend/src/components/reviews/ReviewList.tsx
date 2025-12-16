import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser, useDeleteReview } from "@/lib/query";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ReviewWithUser } from "@/lib/api/types";

interface ReviewListProps {
  reviews: ReviewWithUser[];
  propertyId: number;
}

export function ReviewList({ reviews, propertyId }: ReviewListProps) {
  const { data: userData } = useUser();
  const deleteReviewMutation = useDeleteReview();
  const currentUserId = userData?.user.id;

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No reviews yet. Be the first to review this property!</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{getInitials(review.user_name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.user_name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {currentUserId === review.user_id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  deleteReviewMutation.mutate(
                    { id: review.id, propertyId },
                    {
                      onSuccess: () => {
                        // Review will be refetched automatically
                      },
                    }
                  )
                }
                disabled={deleteReviewMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="mb-2">
            <StarRating rating={review.rating} size={16} />
          </div>
          <p className="text-sm whitespace-pre-wrap">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

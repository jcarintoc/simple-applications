import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useRateTitle, useRemoveRating } from "@/lib/query";
import type { TitleWithUserData } from "@/lib/api";
import { cn } from "@/lib/utils";

interface RatingDialogProps {
  title: TitleWithUserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RatingDialog({ title, open, onOpenChange }: RatingDialogProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const rateTitle = useRateTitle();
  const removeRating = useRemoveRating();

  if (!title) return null;

  const currentRating = title.user_rating || hoveredRating || 0;

  const handleRatingClick = (rating: number) => {
    if (rating === title.user_rating) {
      // Remove rating if clicking the same rating
      removeRating.mutate(title.id, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else {
      rateTitle.mutate(
        { titleId: title.id, data: { rating } },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  const handleRemoveRating = () => {
    removeRating.mutate(title.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate {title.title}</DialogTitle>
          <DialogDescription>
            Click on a star to rate this {title.type}. Click again to remove your rating.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(null)}
                className="transition-transform hover:scale-110"
                aria-label={`Rate ${rating} out of 5`}
              >
                <Star
                  className={cn(
                    "size-10 transition-colors",
                    rating <= currentRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          {title.user_rating && (
            <Button
              variant="outline"
              onClick={handleRemoveRating}
              disabled={removeRating.isPending}
            >
              Remove Rating
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
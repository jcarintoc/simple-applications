import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  likesCount: number;
  hasLiked?: boolean;
  onLike: () => void;
  disabled?: boolean;
}

export function LikeButton({ likesCount, hasLiked = false, onLike, disabled }: LikeButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onLike}
      disabled={disabled}
      className={cn(
        "gap-2",
        hasLiked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart className={cn("h-5 w-5", hasLiked && "fill-red-500")} />
      <span className={cn("text-sm font-medium", hasLiked && "text-red-500")}>
        {likesCount}
      </span>
    </Button>
  );
}

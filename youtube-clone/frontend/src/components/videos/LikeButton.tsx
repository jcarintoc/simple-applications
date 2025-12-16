import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useLikeVideo, useUnlikeVideo } from "@/lib/query/likes";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  videoId: number;
  isLiked: boolean;
  likeCount: number;
  disabled?: boolean;
}

const LikeButton = ({ videoId, isLiked, likeCount, disabled }: LikeButtonProps) => {
  const likeMutation = useLikeVideo();
  const unlikeMutation = useUnlikeVideo();

  const handleClick = () => {
    if (disabled) return;

    if (isLiked) {
      unlikeMutation.mutate(videoId);
    } else {
      likeMutation.mutate(videoId);
    }
  };

  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={disabled || isPending}
      className={cn(
        "gap-1.5",
        isLiked && "bg-primary text-primary-foreground"
      )}
    >
      <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
      <span>{likeCount}</span>
    </Button>
  );
};

export default LikeButton;

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  upvotes: number;
  hasVoted?: boolean;
  onVote: () => void;
  disabled?: boolean;
  size?: "sm" | "default";
}

export function VoteButton({ upvotes, hasVoted = false, onVote, disabled, size = "default" }: VoteButtonProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size={size}
        onClick={onVote}
        disabled={disabled}
        className={cn(
          "h-auto p-1",
          hasVoted && "text-orange-500 hover:text-orange-600"
        )}
      >
        <ArrowUp className={cn("h-4 w-4", hasVoted && "fill-orange-500")} />
      </Button>
      <span className={cn("text-xs font-medium", hasVoted && "text-orange-500")}>
        {upvotes}
      </span>
    </div>
  );
}

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckSaved, useToggleSaved } from "@/lib/query";
import { useUser } from "@/lib/query";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  hotelId: number;
  variant?: "icon" | "button";
}

export function SaveButton({ hotelId, variant = "icon" }: SaveButtonProps) {
  const { data: user } = useUser();
  const { data: savedData, isLoading } = useCheckSaved(hotelId, !!user);
  const toggleMutation = useToggleSaved();

  const isSaved = savedData?.saved || false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleMutation.mutate(hotelId);
  };

  if (!user) return null;

  if (variant === "button") {
    return (
      <Button
        variant={isSaved ? "default" : "outline"}
        onClick={handleClick}
        disabled={toggleMutation.isPending || isLoading}
      >
        <Heart
          className={cn("h-4 w-4", isSaved && "fill-current")}
        />
        {isSaved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      variant="secondary"
      className="h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-white"
      onClick={handleClick}
      disabled={toggleMutation.isPending || isLoading}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
        )}
      />
    </Button>
  );
}

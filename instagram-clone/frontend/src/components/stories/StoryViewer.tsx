import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import type { StoryWithAuthor } from "@/lib/api/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryViewerProps {
  stories: StoryWithAuthor[];
  currentIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function StoryViewer({
  stories,
  currentIndex,
  open,
  onOpenChange,
  onNext,
  onPrevious,
}: StoryViewerProps) {
  if (stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-black border-none">
        <div className="relative aspect-[9/16] bg-black">
          <img
            src={currentStory.image_url}
            alt={currentStory.author_name}
            className="w-full h-full object-contain"
          />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white hover:bg-black/50"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Navigation buttons */}
          {currentIndex > 0 && onPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-black/50"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {currentIndex < stories.length - 1 && onNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-black/50"
              onClick={onNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          {/* Story info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="text-white font-semibold">{currentStory.author_name}</div>
            <div className="text-white/80 text-sm">
              {new Date(currentStory.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

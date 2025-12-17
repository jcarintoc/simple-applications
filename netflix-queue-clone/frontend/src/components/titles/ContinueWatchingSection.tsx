import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useContinueWatching, useUpdateProgress, useRemoveFromContinueWatching } from "@/lib/query";
import { TitleCard } from "./TitleCard";

export function ContinueWatchingSection() {
  const { data, isLoading } = useContinueWatching();
  const updateProgress = useUpdateProgress();
  const removeFromContinueWatching = useRemoveFromContinueWatching();

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-muted-foreground">Loading continue watching...</p>
      </div>
    );
  }

  const items = data?.items || [];

  if (items.length === 0) {
    return null;
  }

  const handleWatchClick = (titleId: number) => {
    // Update progress to simulate watching
    const currentItem = data?.items.find((i) => i.title_id === titleId);
    const newProgress = Math.min((currentItem?.progress_percent || 0) + 10, 100);
    updateProgress.mutate({
      titleId,
      data: { progress_percent: newProgress },
    });
  };

  const handleRemoveClick = (titleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromContinueWatching.mutate(titleId);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Continue Watching</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => {
          const progress = item.progress_percent;
          const titleWithUserData = {
            ...item.title,
            in_watchlist: false,
            user_rating: null,
            avg_rating: null,
          };

          return (
            <div key={item.id} className="group relative">
              <TitleCard
                title={titleWithUserData}
                onWatchClick={() => handleWatchClick(item.title_id)}
                showWatchlistButton={false}
              />
              <div className="absolute left-0 right-0 top-[calc(66.67%+1px)] z-10 h-1 bg-muted/50">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 z-20 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => handleRemoveClick(item.title_id, e)}
                disabled={removeFromContinueWatching.isPending}
              >
                <X className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
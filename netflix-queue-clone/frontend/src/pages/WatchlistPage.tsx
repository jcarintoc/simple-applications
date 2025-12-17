import { useState } from "react";
import { useWatchlist } from "@/lib/query";
import { TitleCard, RatingDialog } from "@/components/titles";
import type { TitleWithUserData } from "@/lib/api";

export function WatchlistPage() {
  const { data, isLoading } = useWatchlist();
  const [selectedTitle, setSelectedTitle] = useState<TitleWithUserData | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);

  const titles = data?.titles || [];

  const handleRatingClick = (titleId: number) => {
    const title = titles.find((t) => t.id === titleId);
    if (title) {
      setSelectedTitle(title);
      setRatingDialogOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 py-8">
        <p className="text-muted-foreground">Loading watchlist...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        {titles.length === 0 ? (
          <p className="text-muted-foreground">Your watchlist is empty. Add titles to watch later!</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {titles.length} {titles.length === 1 ? "title" : "titles"} in your watchlist
          </p>
        )}
      </div>

      {titles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {titles.map((title) => (
            <TitleCard
              key={title.id}
              title={title}
              onRatingClick={handleRatingClick}
            />
          ))}
        </div>
      )}

      <RatingDialog
        title={selectedTitle}
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
      />
    </div>
  );
}
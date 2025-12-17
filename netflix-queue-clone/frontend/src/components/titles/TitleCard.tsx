import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, Star } from "lucide-react";
import type { TitleWithUserData } from "@/lib/api";
import { useToggleWatchlist } from "@/lib/query";

interface TitleCardProps {
  title: TitleWithUserData;
  onRatingClick?: (titleId: number) => void;
  onWatchClick?: () => void;
  showWatchlistButton?: boolean;
}

// Generate a gradient color based on title string
function getGradientFromTitle(title: string): string {
  const colors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
  ];
  
  // Use title to consistently pick a color
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function TitleCard({
  title,
  onRatingClick,
  onWatchClick,
  showWatchlistButton = true,
}: TitleCardProps) {
  const [imageError, setImageError] = useState(false);
  const toggleWatchlist = useToggleWatchlist();
  const gradient = getGradientFromTitle(title.title);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist.mutate(title.id);
  };

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWatchClick) {
      onWatchClick();
    }
  };

  const handleRatingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRatingClick) {
      onRatingClick(title.id);
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg p-0 gap-0">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {!imageError && title.thumbnail_url ? (
          <img
            src={title.thumbnail_url}
            alt={title.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center p-4 text-white"
            style={{ background: gradient }}
          >
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold drop-shadow-lg">
                {title.title.split(" ").map((word) => word.charAt(0)).join("")}
              </div>
              <div className="text-sm font-medium opacity-90 drop-shadow">
                {title.release_year}
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-full space-y-2 p-4 transition-transform group-hover:translate-y-0">
          {showWatchlistButton && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleWatchlistClick}
              disabled={toggleWatchlist.isPending}
              className="w-full"
            >
              {title.in_watchlist ? (
                <>
                  <Check className="size-4" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Add to Watchlist
                </>
              )}
            </Button>
          )}
          {onWatchClick && (
            <Button
              size="sm"
              onClick={handleWatchClick}
              className="w-full"
            >
              Watch
            </Button>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold leading-tight">
              {title.title}
            </h3>
            <Badge variant="outline" className="shrink-0">
              {title.type}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{title.release_year}</span>
            {title.type === "movie" && title.duration_minutes && (
              <>
                <span>•</span>
                <span>{title.duration_minutes} min</span>
              </>
            )}
            {title.type === "show" && title.seasons && (
              <>
                <span>•</span>
                <span>{title.seasons} {title.seasons === 1 ? "season" : "seasons"}</span>
              </>
            )}
          </div>
          {title.genre && (
            <Badge variant="secondary" className="text-xs">
              {title.genre}
            </Badge>
          )}
          <div className="flex items-center gap-2">
            {title.user_rating && (
              <button
                onClick={handleRatingClick}
                className="flex items-center gap-1 text-sm hover:underline"
              >
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{title.user_rating}</span>
                <span className="text-muted-foreground">/ 5</span>
              </button>
            )}
            {!title.user_rating && onRatingClick && (
              <button
                onClick={handleRatingClick}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Star className="size-4" />
                <span>Rate</span>
              </button>
            )}
            {title.avg_rating && (
              <span className="text-sm text-muted-foreground">
                Avg: {title.avg_rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { Heart, MoreHorizontal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Song, Playlist } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
  isAuthenticated: boolean;
  playlists?: Playlist[];
  onToggleLike?: (songId: number) => void;
  onAddToPlaylist?: (playlistId: number, songId: number) => void;
  onRemoveFromPlaylist?: (songId: number) => void;
  showRemoveOption?: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function SongCard({
  song,
  index,
  showIndex = false,
  isAuthenticated,
  playlists = [],
  onToggleLike,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  showRemoveOption = false,
}: SongCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-md p-2 hover:bg-accent">
      {showIndex && index !== undefined && (
        <span className="w-6 text-center text-sm text-muted-foreground">
          {index + 1}
        </span>
      )}

      <img
        src={song.cover_url || "https://placehold.co/48x48/1DB954/white?text=♪"}
        alt={song.title}
        className="h-12 w-12 rounded object-cover"
      />

      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{song.title}</p>
        <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
      </div>

      <span className="text-sm text-muted-foreground hidden sm:block">
        {song.album}
      </span>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleLike?.(song.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                song.is_liked && "fill-green-500 text-green-500"
              )}
            />
          </Button>
        )}

        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDuration(song.duration_seconds)}
        </span>

        {isAuthenticated && (playlists.length > 0 || showRemoveOption) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist.id}
                  onClick={() => onAddToPlaylist?.(playlist.id, song.id)}
                >
                  Add to {playlist.name}
                </DropdownMenuItem>
              ))}
              {showRemoveOption && (
                <DropdownMenuItem
                  onClick={() => onRemoveFromPlaylist?.(song.id)}
                  className="text-destructive"
                >
                  Remove from playlist
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

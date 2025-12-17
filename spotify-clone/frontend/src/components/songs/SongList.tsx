import { SongCard } from "./SongCard";
import type { Song, Playlist } from "@/lib/api";

interface SongListProps {
  songs: Song[];
  showIndex?: boolean;
  isAuthenticated: boolean;
  playlists?: Playlist[];
  onToggleLike?: (songId: number) => void;
  onAddToPlaylist?: (playlistId: number, songId: number) => void;
  onRemoveFromPlaylist?: (songId: number) => void;
  showRemoveOption?: boolean;
  emptyMessage?: string;
}

export function SongList({
  songs,
  showIndex = false,
  isAuthenticated,
  playlists = [],
  onToggleLike,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  showRemoveOption = false,
  emptyMessage = "No songs found",
}: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {songs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          index={index}
          showIndex={showIndex}
          isAuthenticated={isAuthenticated}
          playlists={playlists}
          onToggleLike={onToggleLike}
          onAddToPlaylist={onAddToPlaylist}
          onRemoveFromPlaylist={onRemoveFromPlaylist}
          showRemoveOption={showRemoveOption}
        />
      ))}
    </div>
  );
}

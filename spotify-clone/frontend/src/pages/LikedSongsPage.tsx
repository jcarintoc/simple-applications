import { Heart } from "lucide-react";
import { SongList } from "@/components/songs";
import { useLikedSongs, usePlaylists, useToggleLike, useAddSongToPlaylist } from "@/lib/query";

export function LikedSongsPage() {
  const { data: songsData, isLoading } = useLikedSongs();
  const { data: playlistsData } = usePlaylists();
  const toggleLikeMutation = useToggleLike();
  const addSongMutation = useAddSongToPlaylist();

  const handleToggleLike = (songId: number) => {
    toggleLikeMutation.mutate(songId);
  };

  const handleAddToPlaylist = (playlistId: number, songId: number) => {
    addSongMutation.mutate({ playlistId, songId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg">
          <Heart className="h-20 w-20 text-white fill-white" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Playlist
          </p>
          <h1 className="text-4xl font-bold">Liked Songs</h1>
          <p className="text-sm text-muted-foreground">
            {songsData?.songs.length || 0} {songsData?.songs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading liked songs...
          </div>
        ) : (
          <SongList
            songs={songsData?.songs || []}
            showIndex
            isAuthenticated
            playlists={playlistsData?.playlists || []}
            onToggleLike={handleToggleLike}
            onAddToPlaylist={handleAddToPlaylist}
            emptyMessage="You haven't liked any songs yet. Browse songs and click the heart to like them!"
          />
        )}
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongList } from "@/components/songs";
import { usePlaylist, useRemoveSongFromPlaylist, useToggleLike } from "@/lib/query";

export function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playlistId = parseInt(id || "0");

  const { data, isLoading, error } = usePlaylist(playlistId);
  const removeSongMutation = useRemoveSongFromPlaylist();
  const toggleLikeMutation = useToggleLike();

  const handleRemoveSong = (songId: number) => {
    removeSongMutation.mutate({ playlistId, songId });
  };

  const handleToggleLike = (songId: number) => {
    toggleLikeMutation.mutate(songId);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading playlist...
      </div>
    );
  }

  if (error || !data?.playlist) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Playlist not found</p>
        <Button variant="outline" onClick={() => navigate("/playlists")}>
          <ArrowLeft className="h-4 w-4" />
          Back to playlists
        </Button>
      </div>
    );
  }

  const { playlist } = data;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/playlists")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to playlists
      </Button>

      <div className="flex items-start gap-6">
        <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-700 shadow-lg">
          <ListMusic className="h-20 w-20 text-white" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Playlist
          </p>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-muted-foreground">{playlist.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {playlist.song_count} {playlist.song_count === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <SongList
          songs={playlist.songs}
          showIndex
          isAuthenticated
          onToggleLike={handleToggleLike}
          onRemoveFromPlaylist={handleRemoveSong}
          showRemoveOption
          emptyMessage="This playlist is empty. Browse songs and add them here!"
        />
      </div>
    </div>
  );
}

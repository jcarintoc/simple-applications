import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SongList } from "@/components/songs";
import { useSongs, useSongSearch, usePlaylists, useToggleLike, useAddSongToPlaylist, useUser } from "@/lib/query";

export function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: user } = useUser();
  const isAuthenticated = !!user?.user;

  const { data: songsData, isLoading: songsLoading } = useSongs();
  const { data: searchData, isLoading: searchLoading } = useSongSearch(searchQuery);
  const { data: playlistsData } = usePlaylists(isAuthenticated);

  const toggleLikeMutation = useToggleLike();
  const addSongMutation = useAddSongToPlaylist();

  const songs = searchQuery ? searchData?.songs : songsData?.songs;
  const isLoading = searchQuery ? searchLoading : songsLoading;

  const handleToggleLike = (songId: number) => {
    toggleLikeMutation.mutate(songId);
  };

  const handleAddToPlaylist = (playlistId: number, songId: number) => {
    addSongMutation.mutate({ playlistId, songId });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Songs</h1>
        <p className="text-muted-foreground">Discover and listen to music</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search songs, artists, albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading songs...
        </div>
      ) : (
        <SongList
          songs={songs || []}
          showIndex
          isAuthenticated={isAuthenticated}
          playlists={playlistsData?.playlists || []}
          onToggleLike={handleToggleLike}
          onAddToPlaylist={handleAddToPlaylist}
          emptyMessage={
            searchQuery
              ? `No songs found for "${searchQuery}"`
              : "No songs available"
          }
        />
      )}
    </div>
  );
}

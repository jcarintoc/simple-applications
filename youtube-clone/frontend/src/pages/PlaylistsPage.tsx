import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlaylistCard, PlaylistForm } from "@/components/playlists";
import { usePlaylists } from "@/lib/query/playlists";
import { Plus, Loader2 } from "lucide-react";

const PlaylistsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: playlists, isLoading } = usePlaylists();

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Playlists</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4" />
          Create Playlist
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any playlists yet</p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4" />
            Create your first playlist
          </Button>
        </div>
      )}

      <PlaylistForm open={showCreateForm} onOpenChange={setShowCreateForm} />
    </div>
  );
};

export default PlaylistsPage;

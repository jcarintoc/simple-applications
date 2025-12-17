import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaylistCard, CreatePlaylistDialog } from "@/components/playlists";
import { usePlaylists, useCreatePlaylist, useDeletePlaylist } from "@/lib/query";

export function PlaylistsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = usePlaylists();
  const createPlaylistMutation = useCreatePlaylist();
  const deletePlaylistMutation = useDeletePlaylist();

  const handleCreatePlaylist = (data: { name: string; description?: string }) => {
    createPlaylistMutation.mutate(data, {
      onSuccess: () => setIsDialogOpen(false),
    });
  };

  const handleDeletePlaylist = (id: number) => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylistMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Playlists</h1>
          <p className="text-muted-foreground">Create and manage your playlists</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          New Playlist
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading playlists...
        </div>
      ) : data?.playlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any playlists yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create your first playlist
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onDelete={handleDeletePlaylist}
            />
          ))}
        </div>
      )}

      <CreatePlaylistDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreatePlaylist}
        isPending={createPlaylistMutation.isPending}
      />
    </div>
  );
}

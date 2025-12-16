import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListPlus, Check, Plus, Loader2 } from "lucide-react";
import { usePlaylists, useAddVideoToPlaylist } from "@/lib/query/playlists";
import PlaylistForm from "./PlaylistForm";

interface AddToPlaylistDialogProps {
  videoId: number;
}

const AddToPlaylistDialog = ({ videoId }: AddToPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: playlists, isLoading } = usePlaylists();
  const addMutation = useAddVideoToPlaylist();

  const handleAddToPlaylist = (playlistId: number) => {
    addMutation.mutate(
      { playlistId, videoId },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <ListPlus className="w-4 h-4" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : playlists && playlists.length > 0 ? (
              playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  disabled={addMutation.isPending}
                >
                  <span className="font-medium">{playlist.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {playlist.video_count} videos
                  </span>
                </button>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No playlists yet
              </p>
            )}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                setOpen(false);
                setShowCreateForm(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Create new playlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PlaylistForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      />
    </>
  );
};

export default AddToPlaylistDialog;

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoCard } from "@/components/videos";
import { PlaylistForm } from "@/components/playlists";
import { usePlaylist, useDeletePlaylist, useRemoveVideoFromPlaylist } from "@/lib/query/playlists";
import { useUser } from "@/lib/query/auth";
import { Pencil, Trash2, Lock, Globe, Loader2, X } from "lucide-react";

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const playlistId = parseInt(id || "0");
  const navigate = useNavigate();

  const [showEditForm, setShowEditForm] = useState(false);

  const { data: playlist, isLoading } = usePlaylist(playlistId);
  const { data: user } = useUser();
  const deleteMutation = useDeletePlaylist();
  const removeVideoMutation = useRemoveVideoFromPlaylist();

  const isOwner = user?.id === playlist?.user_id;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      deleteMutation.mutate(playlistId, {
        onSuccess: () => navigate("/playlists"),
      });
    }
  };

  const handleRemoveVideo = (videoId: number) => {
    removeVideoMutation.mutate({ playlistId, videoId });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Playlist not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                {playlist.is_public ? (
                  <Globe className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              {playlist.description && (
                <p className="text-muted-foreground mt-2">{playlist.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {playlist.video_count} videos • Created by {playlist.user_name}
              </p>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditForm(true)}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {playlist.videos && playlist.videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlist.videos.map((video) => (
            <div key={video.id} className="relative group">
              <VideoCard video={video} />
              {isOwner && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveVideo(video.id);
                  }}
                  disabled={removeVideoMutation.isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">This playlist is empty</p>
        </div>
      )}

      {playlist && (
        <PlaylistForm
          open={showEditForm}
          onOpenChange={setShowEditForm}
          playlist={playlist}
        />
      )}
    </div>
  );
};

export default PlaylistPage;

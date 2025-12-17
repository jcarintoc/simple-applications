import { ListMusic, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Playlist } from "@/lib/api";

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete?: (id: number) => void;
}

export function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
  return (
    <Card className="group hover:bg-accent transition-colors p-0">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded bg-gradient-to-br from-green-500 to-green-700">
            <ListMusic className="h-8 w-8 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/playlists/${playlist.id}`}
              className="font-semibold hover:underline block truncate"
            >
              {playlist.name}
            </Link>
            {playlist.description && (
              <p className="text-sm text-muted-foreground truncate">
                {playlist.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Created {new Date(playlist.created_at).toLocaleDateString()}
            </p>
          </div>

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onDelete(playlist.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

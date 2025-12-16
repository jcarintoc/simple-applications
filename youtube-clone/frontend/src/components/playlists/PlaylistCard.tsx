import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListVideo, Lock, Globe } from "lucide-react";
import type { Playlist } from "@/lib/api/types";

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  return (
    <Link to={`/playlist/${playlist.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-video bg-muted flex items-center justify-center">
          <ListVideo className="w-12 h-12 text-muted-foreground" />
          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 bg-black/80 text-white text-xs"
          >
            {playlist.video_count} videos
          </Badge>
        </div>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors flex-1">
              {playlist.name}
            </h3>
            {playlist.is_public ? (
              <Globe className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          {playlist.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {playlist.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PlaylistCard;

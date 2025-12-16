import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, MessageCircle, Clock } from "lucide-react";
import type { Video } from "@/lib/api/types";

interface VideoCardProps {
  video: Video;
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";

  return (
    <Link to={`/watch/${video.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-video bg-muted">
          <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
            <span className="text-4xl text-zinc-500">
              {video.title.charAt(0).toUpperCase()}
            </span>
          </div>
          {video.duration > 0 && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 right-2 bg-black/80 text-white text-xs"
            >
              <Clock className="w-3 h-3" />
              {formatDuration(video.duration)}
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{video.user_name}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {video.like_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {video.comment_count}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(video.created_at)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VideoCard;

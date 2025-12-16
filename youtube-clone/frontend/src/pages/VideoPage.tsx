import { useParams } from "react-router";
import { VideoPlayer, LikeButton } from "@/components/videos";
import { CommentList } from "@/components/comments";
import { AddToPlaylistDialog } from "@/components/playlists";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, Calendar, User } from "lucide-react";
import { useVideo, useIncrementViews } from "@/lib/query/videos";
import { useUser } from "@/lib/query/auth";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
}

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const videoId = parseInt(id || "0");

  const { data: video, isLoading } = useVideo(videoId);
  const { data: user } = useUser();
  const incrementViews = useIncrementViews();

  const handlePlay = () => {
    incrementViews.mutate(videoId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-muted rounded-lg animate-pulse" />
          <div className="mt-4 space-y-2">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Video not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <VideoPlayer video={video} onPlay={handlePlay} />

        <Card className="mt-4">
          <CardContent className="pt-4">
            <h1 className="text-xl font-bold">{video.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViews(video.views)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(video.created_at)}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{video.user_name}</p>
                  <p className="text-sm text-muted-foreground">{video.user_email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <LikeButton
                  videoId={video.id}
                  isLiked={video.is_liked || false}
                  likeCount={video.like_count}
                  disabled={!user}
                />
                {user && <AddToPlaylistDialog videoId={video.id} />}
              </div>
            </div>

            {video.description && (
              <>
                <Separator className="my-4" />
                <p className="text-sm whitespace-pre-wrap">{video.description}</p>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">
            Comments ({video.comment_count})
          </h2>
          <CommentList videoId={video.id} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;

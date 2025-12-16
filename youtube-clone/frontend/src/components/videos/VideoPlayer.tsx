import { useEffect, useRef } from "react";
import type { Video } from "@/lib/api/types";

interface VideoPlayerProps {
  video: Video;
  onPlay?: () => void;
}

const VideoPlayer = ({ video, onPlay }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayed = useRef(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => {
      if (!hasPlayed.current && onPlay) {
        hasPlayed.current = true;
        onPlay();
      }
    };

    videoElement.addEventListener("play", handlePlay);
    return () => videoElement.removeEventListener("play", handlePlay);
  }, [onPlay]);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        src={`${API_BASE_URL}/uploads/videos/${video.filename}`}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;

import { VideoGrid } from "@/components/videos";
import { useVideos } from "@/lib/query/videos";

const HomePage = () => {
  const { data, isLoading } = useVideos(1, 20);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Videos</h1>
      <VideoGrid videos={data?.videos || []} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;

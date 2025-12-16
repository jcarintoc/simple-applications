import { useSearchParams } from "react-router";
import { VideoGrid } from "@/components/videos";
import { useSearchVideos } from "@/lib/query/videos";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useSearchVideos(query);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>
      </div>

      {!query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter a search term to find videos</p>
        </div>
      ) : (
        <>
          {data && data.videos.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Found {data.total} video{data.total !== 1 ? "s" : ""}
            </p>
          )}
          <VideoGrid videos={data?.videos || []} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default SearchPage;

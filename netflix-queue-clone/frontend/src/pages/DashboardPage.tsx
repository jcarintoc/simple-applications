import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useTitles, useSearchTitles, useGenres } from "@/lib/query";
import { TitleCard, RatingDialog, ContinueWatchingSection } from "@/components/titles";
import { useDebounce } from "@/lib/hooks";
import type { TitleWithUserData, TitleType } from "@/lib/api";

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedType, setSelectedType] = useState<TitleType | undefined>();
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [selectedTitle, setSelectedTitle] = useState<TitleWithUserData | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);

  const { data: titlesData, isLoading: titlesLoading } = useTitles(selectedType);
  const { data: searchData, isLoading: searchLoading } = useSearchTitles(debouncedSearchQuery);
  const { data: genresData } = useGenres();

  const isLoading = titlesLoading || searchLoading;
  const titles = debouncedSearchQuery ? searchData?.titles || [] : titlesData?.titles || [];
  const genres = genresData?.genres || [];

  // Filter by genre if selected
  const filteredTitles = selectedGenre
    ? titles.filter((title) => title.genre === selectedGenre)
    : titles;

  const handleRatingClick = (titleId: number) => {
    const title = filteredTitles.find((t) => t.id === titleId);
    if (title) {
      setSelectedTitle(title);
      setRatingDialogOpen(true);
    }
  };

  const handleWatchClick = (titleId: number) => {
    // For now, just log. You can implement navigation to a watch page later
    console.log("Watch title:", titleId);
  };

  const clearFilters = () => {
    setSelectedType(undefined);
    setSelectedGenre(undefined);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedType || selectedGenre || searchQuery;

  return (
    <div className="container mx-auto space-y-8 p-4 py-8">
      {/* Continue Watching Section */}
      <ContinueWatchingSection />

      {/* Browse Section */}
      <section className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Browse Movies & Shows</h1>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Type:</span>
            <Button
              variant={selectedType === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(undefined)}
            >
              All
            </Button>
            <Button
              variant={selectedType === "movie" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("movie")}
            >
              Movies
            </Button>
            <Button
              variant={selectedType === "show" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("show")}
            >
              Shows
            </Button>

            {genres.length > 0 && (
              <>
                <span className="ml-4 text-sm font-medium">Genre:</span>
                <Button
                  variant={selectedGenre === undefined ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(undefined)}
                >
                  All
                </Button>
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </>
            )}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results count */}
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              {filteredTitles.length} {filteredTitles.length === 1 ? "title" : "titles"} found
            </p>
          )}
        </div>

        {/* Titles Grid */}
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading titles...</div>
        ) : filteredTitles.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No titles found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTitles.map((title) => (
              <TitleCard
                key={title.id}
                title={title}
                onRatingClick={handleRatingClick}
                onWatchClick={() => handleWatchClick(title.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Rating Dialog */}
      <RatingDialog
        title={selectedTitle}
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
      />
    </div>
  );
}

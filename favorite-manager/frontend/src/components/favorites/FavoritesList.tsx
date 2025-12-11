import { useState, useMemo, useEffect } from "react";
import { useFavorites } from "@/lib/query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { DeleteFavoriteDialog } from "./DeleteFavoriteDialog";
import { EditFavoriteDialog } from "./EditFavoriteDialog";
import { Button } from "@/components/ui/button";
import {
  Film,
  Music,
  BookOpen,
  Gamepad2,
  Tv,
  Folder,
  Heart,
  Calendar,
  Loader2,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react";
import type { FavoriteCategory } from "@/lib/api";

type ViewMode = "card" | "list";

const ITEMS_PER_PAGE = 6;

const CATEGORY_ICONS: Record<FavoriteCategory, typeof Film> = {
  Movie: Film,
  Song: Music,
  Book: BookOpen,
  Game: Gamepad2,
  Show: Tv,
  Other: Folder,
};

const CATEGORY_COLORS: Record<
  FavoriteCategory,
  "default" | "secondary" | "outline"
> = {
  Movie: "default",
  Song: "secondary",
  Book: "outline",
  Game: "default",
  Show: "secondary",
  Other: "outline",
};

const ALL_CATEGORIES: FavoriteCategory[] = [
  "Movie",
  "Song",
  "Book",
  "Game",
  "Show",
  "Other",
];

export function FavoritesList() {
  const { data: favorites = [], isLoading, error } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<
    FavoriteCategory | "All"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const filteredFavorites = useMemo(() => {
    if (selectedCategory === "All") {
      return favorites;
    }
    return favorites.filter((f) => f.category === selectedCategory);
  }, [favorites, selectedCategory]);

  const totalPages = Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFavorites = filteredFavorites.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="size-8 text-destructive mb-4" />
        <p className="text-destructive">
          Failed to load favorites. Please try again.
        </p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="size-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg mb-2">No favorites yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first favorite to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryCount = (category: FavoriteCategory | "All") => {
    if (category === "All") return favorites.length;
    return favorites.filter((f) => f.category === category).length;
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={selectedCategory}
        onValueChange={(value) => {
          setSelectedCategory(value as FavoriteCategory | "All");
          setCurrentPage(1);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="All" className="flex items-center">
            <Heart className="size-3.5" />
            <span className="hidden sm:inline">All</span>
            <span>({getCategoryCount("All")})</span>
          </TabsTrigger>
          {ALL_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            const count = getCategoryCount(category);
            if (count === 0) return null;
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="flex items-center gap-2"
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{category}</span>
                <span>({count})</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredFavorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="size-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No favorites in this category yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* View Toggle */}
              <div className="flex justify-end mb-4">
                <div className="inline-flex items-center rounded-lg p-1 bg-muted/50 gap-1 border border-border/75">
                  <Button
                    variant={viewMode === "card" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("card")}
                    className="gap-2"
                  >
                    <LayoutGrid className="size-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="gap-2"
                  >
                    <List className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Card View */}
              {viewMode === "card" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedFavorites.map((favorite) => {
                    const CategoryIcon = CATEGORY_ICONS[favorite.category];
                    return (
                      <Card
                        key={favorite.id}
                        className="hover:shadow-md transition-shadow gap-4 p-0"
                      >
                        <CardHeader className="p-3">
                          <div className="flex items-center justify-between">
                            <Badge variant={CATEGORY_COLORS[favorite.category]}>
                              <CategoryIcon /> {favorite.category}
                            </Badge>

                            <div className="flex items-center gap-1">
                              <EditFavoriteDialog favorite={favorite} />
                              <DeleteFavoriteDialog favorite={favorite} />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              {favorite.name}
                            </CardTitle>
                          </div>
                        </CardHeader>

                        <CardContent className="px-0 flex items-center gap-2 text-xs text-muted-foreground p-3 border-t">
                          <Calendar className="size-3" />
                          <span>
                            {new Date(favorite.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <Card className="p-0">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {paginatedFavorites.map((favorite) => {
                        const CategoryIcon = CATEGORY_ICONS[favorite.category];
                        return (
                          <div
                            key={favorite.id}
                            className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex items-center justify-center size-13 rounded-lg bg-muted border">
                                <CategoryIcon className="size-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {favorite.name}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <Badge
                                    variant={CATEGORY_COLORS[favorite.category]}
                                    className="text-xs"
                                  >
                                    {favorite.category}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {new Date(
                                      favorite.created_at
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              <EditFavoriteDialog favorite={favorite} />
                              <DeleteFavoriteDialog favorite={favorite} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(currentPage - 1);
                            }
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(currentPage + 1);
                            }
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

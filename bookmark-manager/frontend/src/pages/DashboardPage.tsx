import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import {
  bookmarkApi,
  type CreateBookmarkDto,
  type UpdateBookmarkDto,
} from "@/lib/api";
import {
  BookmarkForm,
  BookmarkList,
  BookmarkFilters,
} from "@/components/bookmarks";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function DashboardPage() {
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading: isBookmarksLoading } = useQuery({
    queryKey: ["bookmarks", searchQuery, selectedTags, page, limit],
    queryFn: () =>
      bookmarkApi.getBookmarks({
        search: searchQuery || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        page,
        limit,
      }),
  });

  const bookmarks = data?.data || [];
  const pagination = data?.pagination;

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => bookmarkApi.getTags(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBookmarkDto) => bookmarkApi.createBookmark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setIsAddDialogOpen(false);
      toast.success("Bookmark created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookmarkDto }) =>
      bookmarkApi.updateBookmark(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Bookmark updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bookmarkApi.deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Bookmark deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = async (data: CreateBookmarkDto | UpdateBookmarkDto) => {
    await createMutation.mutateAsync(data as CreateBookmarkDto);
  };

  const handleUpdate = async (id: number, data: UpdateBookmarkDto) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  // Reset to page 1 when search or tags change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedTags]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationItems = () => {
    if (!pagination) return null;

    const items = [];
    const { totalPages, page: currentPage } = pagination;

    // Show first page
    if (currentPage > 2) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <span className="px-4 text-slate-500">...</span>
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <span className="px-4 text-slate-500">...</span>
        </PaginationItem>
      );
    }

    // Show last page
    if (currentPage < totalPages - 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Bookmarks</h2>
            <Badge className="bg-blue-100 text-blue-600 mt-2">
              {pagination?.total || 0} {pagination?.total === 1 ? "bookmark" : "bookmarks"} saved
            </Badge>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> New Bookmark
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-6">
            <BookmarkFilters
              availableTags={tags}
              selectedTags={selectedTags}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onTagsChange={setSelectedTags}
            />
          </aside>

          <main className="space-y-6">
            <BookmarkList
              bookmarks={bookmarks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onCopyToClipboard={copyToClipboard}
              isLoading={isBookmarksLoading}
            />

            {pagination && pagination.totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
                      className={page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </main>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogDescription>
              Save a new link to your collection
            </DialogDescription>
          </DialogHeader>
          <BookmarkForm
            onSubmit={handleCreate}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

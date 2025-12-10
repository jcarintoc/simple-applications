import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser, useLogout } from "@/lib/query";
import { bookmarkApi, type CreateBookmarkDto, type UpdateBookmarkDto } from "@/lib/api";
import { BookmarkForm, BookmarkList, BookmarkFilters } from "@/components/bookmarks";

export function DashboardPage() {
  const { data: userData, isLoading: isUserLoading } = useUser();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: bookmarks = [], isLoading: isBookmarksLoading } = useQuery({
    queryKey: ["bookmarks", searchQuery, selectedTags],
    queryFn: () => bookmarkApi.getBookmarks({
      search: searchQuery || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    }),
  });

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
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookmarkDto }) =>
      bookmarkApi.updateBookmark(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bookmarkApi.deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCreate = async (data: CreateBookmarkDto) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (id: number, data: UpdateBookmarkDto) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-600 font-medium">Loading...</div>
      </div>
    );
  }

  const user = userData?.user;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-900">Bookmarks</h1>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-slate-400">signed in as</span>
                <span className="font-medium text-slate-700">{user?.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="text-slate-600 hover:text-slate-900"
              >
                {logoutMutation.isPending ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
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

          <main>
            <BookmarkList
              bookmarks={bookmarks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              isLoading={isBookmarksLoading}
            />
          </main>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogDescription>Save a new link to your collection</DialogDescription>
          </DialogHeader>
          <BookmarkForm
            onSubmit={handleCreate}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

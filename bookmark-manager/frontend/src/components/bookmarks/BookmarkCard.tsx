import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BookmarkForm } from "./BookmarkForm";
import type { BookmarkWithTags, UpdateBookmarkDto } from "../../lib/api";
import { Copy, EllipsisVertical, Pencil, Trash } from "lucide-react";

interface BookmarkCardProps {
  bookmark: BookmarkWithTags;
  onUpdate: (id: number, data: UpdateBookmarkDto) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onCopyToClipboard: (url: string) => void;
}

export function BookmarkCard({
  bookmark,
  onUpdate,
  onDelete,
  onCopyToClipboard,
}: BookmarkCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data: UpdateBookmarkDto) => {
    setIsLoading(true);
    try {
      await onUpdate(bookmark.id, data);
      setIsEditDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(bookmark.id);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <>
      <article className="group bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all">
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 w-fit"
              >
                {bookmark.title}
              </a>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>{getDomain(bookmark.url)}</span>
                <span>•</span>
                <span>{formatDate(bookmark.created_at)}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon-sm"}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onCopyToClipboard(bookmark.url)}
                >
                  <Copy className="size-4 mr-1" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="size-4 mr-1" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash className="text-red-600 size-4 mr-1" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {bookmark.description && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {bookmark.description}
            </p>
          )}

          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {bookmark.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bookmark</DialogTitle>
            <DialogDescription>Update your bookmark details</DialogDescription>
          </DialogHeader>
          <BookmarkForm
            initialData={{
              url: bookmark.url,
              title: bookmark.title,
              description: bookmark.description || undefined,
              tags: bookmark.tags.map((t) => t.name),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bookmark</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bookmark.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

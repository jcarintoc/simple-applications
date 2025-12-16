import { Trash2, Archive, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDeleteEmail,
  useArchive,
  useMarkAsRead,
  useMarkAsUnread,
  usePermanentDelete,
} from "@/lib/query/emails";
import type { EmailFolder } from "@/lib/api/types";

interface BulkActionsToolbarProps {
  selectedIds: number[];
  folder: EmailFolder;
  onClearSelection: () => void;
}

export function BulkActionsToolbar({
  selectedIds,
  folder,
  onClearSelection,
}: BulkActionsToolbarProps) {
  const deleteMutation = useDeleteEmail();
  const permanentDeleteMutation = usePermanentDelete();
  const archiveMutation = useArchive();
  const markAsReadMutation = useMarkAsRead();
  const markAsUnreadMutation = useMarkAsUnread();

  const isTrash = folder === "trash";
  const isArchive = folder === "archive";

  const handleDelete = () => {
    if (isTrash) {
      selectedIds.forEach((id) => {
        permanentDeleteMutation.mutate(id);
      });
    } else {
      selectedIds.forEach((id) => {
        deleteMutation.mutate(id);
      });
    }
    onClearSelection();
  };

  const handleArchive = () => {
    selectedIds.forEach((id) => {
      archiveMutation.mutate(id);
    });
    onClearSelection();
  };

  const handleMarkAsRead = () => {
    selectedIds.forEach((id) => {
      markAsReadMutation.mutate(id);
    });
    onClearSelection();
  };

  const handleMarkAsUnread = () => {
    selectedIds.forEach((id) => {
      markAsUnreadMutation.mutate(id);
    });
    onClearSelection();
  };

  const isLoading =
    deleteMutation.isPending ||
    permanentDeleteMutation.isPending ||
    archiveMutation.isPending ||
    markAsReadMutation.isPending ||
    markAsUnreadMutation.isPending;

  return (
    <div className="border-b bg-muted/50 p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {selectedIds.length} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        {folder === "inbox" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsRead}
              disabled={isLoading}
            >
              <CheckCheck className="h-4 w-4" />
              Mark as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsUnread}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Mark as unread
            </Button>
          </>
        )}
        {folder !== "archive" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleArchive}
            disabled={isLoading}
          >
            <Archive className="h-4 w-4" />
            {isTrash ? "Archive & Restore" : "Archive"}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
          {isTrash ? "Delete permanently" : "Delete"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { Archive, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useArchive,
  useUnarchive,
  useDeleteEmail,
  useMarkAsRead,
  useMarkAsUnread,
  usePermanentDelete,
} from "@/lib/query/emails";
import { useUser } from "@/lib/query";
import type { Email } from "@/lib/api/types";

interface EmailViewProps {
  email: Email;
}

export function EmailView({ email }: EmailViewProps) {
  const navigate = useNavigate();
  const { data: userData } = useUser();
  const archiveMutation = useArchive();
  const unarchiveMutation = useUnarchive();
  const deleteMutation = useDeleteEmail();
  const permanentDeleteMutation = usePermanentDelete();
  const markAsReadMutation = useMarkAsRead();
  const markAsUnreadMutation = useMarkAsUnread();

  // Check if email is in trash (is_deleted = 1), not just the URL path
  const isTrash = email.is_deleted === 1;

  const currentUserId = userData?.user.id;
  const isRecipient = currentUserId && email.to_user_id === currentUserId;
  const isSender = currentUserId && email.from_user_id === currentUserId;
  const canArchive = isRecipient || isSender;
  
  // Check archive status based on whether user is sender or recipient
  const isArchived = isSender 
    ? (email.archived_by_sender === 1)
    : isRecipient 
    ? (email.archived_by_recipient === 1)
    : false;

  // Mark as read when viewing (only if user is recipient, not sender)
  React.useEffect(() => {
    if (email && !email.is_read && isRecipient) {
      // Only auto-mark as read if user is the recipient (inbox emails)
      // For sent emails, user is the sender, so don't auto-mark
      markAsReadMutation.mutate(email.id);
    }
  }, [email.id, isRecipient]);

  const handleArchive = () => {
    // Allow archiving from trash even if already archived (to restore from trash)
    // Otherwise, don't allow archiving if already archived
    if (isArchived && !isTrash) {
      return;
    }
    archiveMutation.mutate(email.id, {
      onSuccess: () => navigate("/"),
    });
  };

  const handleUnarchive = () => {
    if (!isArchived) {
      return;
    }
    unarchiveMutation.mutate(email.id, {
      onSuccess: () => navigate("/"),
    });
  };

  const handleDelete = () => {
    if (isTrash) {
      permanentDeleteMutation.mutate(email.id, {
        onSuccess: () => navigate("/"),
      });
    } else {
      deleteMutation.mutate(email.id, {
        onSuccess: () => navigate("/"),
      });
    }
  };

  const handleToggleRead = () => {
    // Only allow marking as read/unread if user is the recipient (not sender)
    if (!isRecipient) return;
    
    if (email.is_read) {
      markAsUnreadMutation.mutate(email.id);
    } else {
      markAsReadMutation.mutate(email.id);
    }
  };

  const date = new Date(email.created_at).toLocaleString();

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          {isRecipient && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleRead}
              disabled={markAsReadMutation.isPending || markAsUnreadMutation.isPending}
            >
              {email.is_read ? "Mark as unread" : "Mark as read"}
            </Button>
          )}
          {canArchive && (
            <>
              {isTrash ? (
                // In trash, always show Archive & Restore (restores from trash and archives)
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleArchive}
                  disabled={archiveMutation.isPending}
                >
                  <Archive className="h-4 w-4" />
                  Archive & Restore
                </Button>
              ) : !isArchived ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleArchive}
                  disabled={archiveMutation.isPending}
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnarchive}
                  disabled={unarchiveMutation.isPending}
                >
                  <Archive className="h-4 w-4" />
                  Unarchive
                </Button>
              )}
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || permanentDeleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
            {isTrash ? "Delete permanently" : "Delete"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">{email.subject}</h1>
          <div className="mb-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">From:</span> {email.from_user_name} ({email.from_user_email})
            </div>
            <div>
              <span className="font-medium">To:</span> {email.to_user_name} ({email.to_user_email})
            </div>
            <div>
              <span className="font-medium">Date:</span> {date}
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="prose max-w-none whitespace-pre-wrap">{email.body}</div>
        </div>
      </div>
    </div>
  );
}
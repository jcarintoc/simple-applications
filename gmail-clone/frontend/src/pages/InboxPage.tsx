import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/email/Sidebar";
import { EmailList } from "@/components/email/EmailList";
import { ComposeDialog } from "@/components/email/ComposeDialog";
import { BulkActionsToolbar } from "@/components/email/BulkActionsToolbar";
import { useEmails } from "@/lib/query/emails";
import type { EmailFolder } from "@/lib/api/types";

export function InboxPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Determine folder from URL path
  const path = window.location.pathname;
  let folder: EmailFolder = "inbox";
  if (path === "/sent") folder = "sent";
  else if (path === "/archive") folder = "archive";
  else if (path === "/trash") folder = "trash";

  const { data: emails, isLoading } = useEmails(folder);

  const handleSelect = (id: number, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(emails?.map(e => e.id) || []));
    } else {
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onComposeClick={() => setIsComposeOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedIds.size > 0 && (
          <BulkActionsToolbar
            selectedIds={Array.from(selectedIds)}
            folder={folder}
            onClearSelection={() => setSelectedIds(new Set())}
          />
        )}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading emails...</p>
          </div>
        ) : (
          <EmailList
            emails={emails || []}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            allSelected={emails && emails.length > 0 && selectedIds.size === emails.length}
            someSelected={selectedIds.size > 0 && selectedIds.size < (emails?.length || 0)}
          />
        )}
      </div>
      <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
    </div>
  );
}
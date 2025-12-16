import { EmailItem } from "./EmailItem";
import { Checkbox } from "@/components/ui/checkbox";
import type { Email } from "@/lib/api/types";

interface EmailListProps {
  emails: Email[];
  selectedIds?: Set<number>;
  onSelect?: (id: number, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  allSelected?: boolean;
  someSelected?: boolean;
}

export function EmailList({
  emails,
  selectedIds,
  onSelect,
  onSelectAll,
  allSelected = false,
  someSelected = false,
}: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No emails</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {onSelectAll && (
        <div className="border-b p-2 flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(checked === true)}
          />
          <span className="text-sm text-muted-foreground">Select all</span>
        </div>
      )}
      {emails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={selectedIds?.has(email.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
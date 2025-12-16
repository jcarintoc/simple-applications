import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import type { Email } from "@/lib/api/types";

interface EmailItemProps {
  email: Email;
  isSelected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
}

export function EmailItem({ email, isSelected = false, onSelect }: EmailItemProps) {
  const handleCheckboxChange = (checked: boolean) => {
    onSelect?.(email.id, checked);
  };

  const handleCheckboxContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const preview = email.body.length > 100 ? `${email.body.substring(0, 100)}...` : email.body;
  const dateObj = new Date(email.created_at);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  let date: string;
  if (diffMins < 1) date = "just now";
  else if (diffMins < 60) date = `${diffMins}m ago`;
  else if (diffHours < 24) date = `${diffHours}h ago`;
  else if (diffDays < 7) date = `${diffDays}d ago`;
  else date = dateObj.toLocaleDateString();

  return (
    <Link
      to={`/email/${email.id}`}
      className={`flex items-center gap-3 p-3 border-b hover:bg-muted/50 transition-colors ${
        !email.is_read ? "bg-blue-50/50 dark:bg-blue-950/20 font-semibold" : ""
      }`}
    >
      {onSelect && (
        <div onClick={handleCheckboxContainerClick} onMouseDown={handleCheckboxContainerClick}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-medium truncate">
            {email.from_user_email}
          </span>
          <span className="text-sm text-muted-foreground shrink-0">{date}</span>
        </div>
        <div className="font-semibold truncate mb-1">{email.subject}</div>
        <div className="text-sm text-muted-foreground truncate">{preview}</div>
      </div>
    </Link>
  );
}
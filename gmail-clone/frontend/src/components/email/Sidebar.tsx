import { Link, useLocation } from "react-router-dom";
import { Inbox, Send, Archive, Trash2, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUnreadCount } from "@/lib/query/emails";
import { useUser, useLogout } from "@/lib/query";
import type { EmailFolder } from "@/lib/api/types";

interface SidebarProps {
  onComposeClick: () => void;
}

export function Sidebar({ onComposeClick }: SidebarProps) {
  const location = useLocation();
  const { data: unreadCount } = useUnreadCount();
  const { data: userData } = useUser();
  const logoutMutation = useLogout();
  
  const user = userData?.user;

  const folders: Array<{ folder: EmailFolder; label: string; icon: React.ReactNode; path: string }> = [
    { folder: "inbox", label: "Inbox", icon: <Inbox className="h-5 w-5" />, path: "/" },
    { folder: "sent", label: "Sent", icon: <Send className="h-5 w-5" />, path: "/sent" },
    { folder: "archive", label: "Archive", icon: <Archive className="h-5 w-5" />, path: "/archive" },
    { folder: "trash", label: "Trash", icon: <Trash2 className="h-5 w-5" />, path: "/trash" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/inbox";
    }
    return location.pathname === path;
  };

  return (
    <div className="w-64 border-r bg-muted/30 h-screen flex flex-col">
      <div className="p-4">
        <Button onClick={onComposeClick} className="w-full" size="lg">
          <Mail className="h-4 w-4" />
          Compose
        </Button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {folders.map(({ folder, label, icon, path }) => (
          <Link
            key={folder}
            to={path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(path)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {icon}
            <span className="flex-1">{label}</span>
            {folder === "inbox" && unreadCount && unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount}</Badge>
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        {user && (
          <>
            <div className="mb-2 px-2">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <Separator className="mb-2" />
          </>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
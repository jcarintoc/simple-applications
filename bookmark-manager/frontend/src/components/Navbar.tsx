import { Button } from "@/components/ui/button";
import { Bookmark, LogOut } from "lucide-react";
import { useUser, useLogout } from "@/lib/query";

const Navbar = () => {
  const { data: userData } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const user = userData?.user;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Bookmarks</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-slate-400">signed in as</span>
              <span className="font-medium text-slate-700">{user?.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut className="w-4 h-4 mr-1.5" /> {logoutMutation.isPending ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

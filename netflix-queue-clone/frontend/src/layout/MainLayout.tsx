import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLogout, useUser } from "@/lib/query";
import { Film, List, LogOut } from "lucide-react";

const MainLayout = () => {
  const location = useLocation();
  const logoutMutation = useLogout();
  const { data: userData } = useUser();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold">
              Netflix Queue
            </Link>
            <div className="hidden gap-1 md:flex">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/">
                  <Film className="size-4" />
                  Browse
                </Link>
              </Button>
              <Button
                variant={isActive("/watchlist") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/watchlist">
                  <List className="size-4" />
                  My Watchlist
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userData?.user.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

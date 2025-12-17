import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, ListMusic, Heart, LogIn, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useLogout } from "@/lib/query";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const location = useLocation();
  const { data: userData } = useUser();
  const logoutMutation = useLogout();
  const isAuthenticated = !!userData?.user;

  const navItems = [
    { to: "/", icon: Home, label: "Browse", requiresAuth: false },
    { to: "/playlists", icon: ListMusic, label: "Playlists", requiresAuth: true },
    { to: "/liked", icon: Heart, label: "Liked Songs", requiresAuth: true },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-500">Spotify Clone</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            if (item.requiresAuth && !isAuthenticated) return null;

            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth section */}
        <div className="mt-auto pt-4 border-t space-y-2">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-sm">
                <p className="font-medium">{userData?.user.name}</p>
                <p className="text-muted-foreground text-xs">{userData?.user.email}</p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-5 w-5" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="w-full justify-start">
                  <LogIn className="h-5 w-5" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="h-5 w-5" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

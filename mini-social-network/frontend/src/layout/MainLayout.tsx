import { Outlet, Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser, useLogout } from "@/lib/query";
import { LogOut } from "lucide-react";

const MainLayout = () => {
  const { data } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const activeClassName = "bg-muted";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <nav className="border">
          <div className="flex items-center justify-between h-[53px] px-4 max-w-[600px] mx-auto">
            <Link
              to="/"
              className="text-xl font-bold hover:bg-muted/50 rounded-full p-2 transition-colors"
            >
              SocialNet
            </Link>

            {data?.user && (
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {logoutMutation.isPending ? "..." : "Logout"}
              </Button>
            )}
          </div>
        </nav>

        <div className="container max-w-[600px] mx-auto">
          <nav className="flex ">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex-1 flex items-center justify-center h-[53px] ${
                  isActive
                    ? activeClassName
                    : "hover:bg-muted/50 transition-colors"
                } relative group`
              }
            >
              <span className="font-medium">For you</span>
            </NavLink>
            {data?.user && (
              <NavLink
                to={`/users/${data.user.id}`}
                className={({ isActive }) =>
                  `flex-1 flex items-center justify-center h-[53px] ${
                    isActive
                      ? activeClassName
                      : "hover:bg-muted/50 transition-colors"
                  } relative group`
                }
              >
                <span className="font-medium">Profile</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="container max-w-[600px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

import { Link, useLocation } from "react-router-dom";
import { Home, User, Users, Briefcase, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout, useUser } from "@/lib/query/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/profile/me", label: "Profile", icon: User },
  { path: "/connections", label: "Network", icon: Users },
  { path: "/jobs", label: "Jobs", icon: Briefcase },
  { path: "/applications", label: "Applications", icon: FileText },
];

export function Header() {
  const location = useLocation();
  const { data } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">LinkedIn Clone</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center px-3 py-2 text-xs transition-colors",
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:block mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:block">
              {data?.user?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="text-gray-500 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block ml-1">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

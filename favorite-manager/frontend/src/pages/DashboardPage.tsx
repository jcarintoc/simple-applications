import { Button } from "@/components/ui/button";
import { useUser, useLogout, useCSRFToken } from "@/lib/query";
import { AddFavoriteDialog, FavoritesList } from "@/components/favorites";
import { Heart, LogOut, User } from "lucide-react";

export function DashboardPage() {
  const { data, isLoading } = useUser();
  const logoutMutation = useLogout();
  // Pre-fetch CSRF token so it's available for mutations
  useCSRFToken();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="size-6 text-primary" />
              <h1 className="text-3xl font-bold">Favorites</h1>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <User className="size-4" />
              Welcome back, {user?.name}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AddFavoriteDialog />
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="size-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        <FavoritesList />
      </div>
    </div>
  );
}

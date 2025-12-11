import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordGenerator, SavedPasswords } from "@/components/password";
import { useUser, useLogout } from "@/lib/query";

export function DashboardPage() {
  const { data, isLoading } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Password Generator */}
            <PasswordGenerator />

          {/* Saved Passwords */}
            <SavedPasswords />
        </div>
      </main>
    </div>
  );
}

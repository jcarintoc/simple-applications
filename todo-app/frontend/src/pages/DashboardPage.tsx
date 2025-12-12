import { Button } from "@/components/ui/button";
import { useUser, useLogout } from "@/lib/query";
import { TodoList } from "@/components/todos";
import { LogOut } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export function DashboardPage() {
  const { data, isLoading } = useUser();
  const logoutMutation = useLogout();

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
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Todo App</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {greeting}, {user?.name}!
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="gap-2 shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <TodoList />
      </main>
    </div>
  );
}

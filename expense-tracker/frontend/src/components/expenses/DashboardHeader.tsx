import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function DashboardHeader({
  userName,
  onLogout,
  isLoggingOut,
}: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
          Expense Ledger
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {userName}
        </p>
      </div>
      <Button variant="outline" onClick={onLogout} disabled={isLoggingOut}>
        <LogOut className="h-4 w-4" />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </header>
  );
}

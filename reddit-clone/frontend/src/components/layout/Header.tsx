import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useLogout } from "@/lib/query";

export function Header() {
  const navigate = useNavigate();
  const { data: userData } = useUser();
  const logoutMutation = useLogout();
  const user = userData?.user;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Home className="h-6 w-6" />
          <span>Reddit Clone</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <Button variant="ghost" asChild>
              <Link to="/subreddits">Subreddits</Link>
            </Button>
          )}
          {user && (
            <Button variant="ghost" asChild>
              <Link to="/submit">
                <PlusCircle className="h-4 w-4" />
                Create Post
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {user.name}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} disabled={logoutMutation.isPending}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

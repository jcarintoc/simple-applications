import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser, useLogout } from "@/lib/query";
import { BookOpen, LogOut, User, PlusCircle, FileText } from "lucide-react";
import { toast } from "sonner";

export const Navbar = () => {
  const { data: userData } = useUser();
  const user = userData?.user;
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/");
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    });
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <BookOpen className="h-5 w-5" />
            <span>Blog</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/posts/new">
                    <PlusCircle className="mr-1 h-4 w-4" />
                    New Post
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="mr-1 h-4 w-4" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/my-posts">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Posts</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

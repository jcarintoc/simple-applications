import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/lib/query";

export function PublicRoute() {
  const { data, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (data?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

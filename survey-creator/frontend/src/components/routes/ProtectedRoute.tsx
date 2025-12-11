import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/lib/query";

export function ProtectedRoute() {
  const { data, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isError || !data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

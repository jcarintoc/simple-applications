import { useNavigate } from "react-router-dom";
import { useUser } from "@/lib/query";
import { useEffect } from "react";

export function DashboardPage() {
  const { data: userData, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && userData) {
      // Redirect to home page (posts listing)
      navigate("/");
    }
  }, [userData, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return null;
}

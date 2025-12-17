import { Heart, Loader2 } from "lucide-react";
import { HotelGrid } from "@/components/hotels";
import { useMySaved, useUser } from "@/lib/query";
import { Link, Navigate } from "react-router-dom";

export function SavedPage() {
  const { data: userData, isLoading: userLoading } = useUser();
  const { data: savedData, isLoading } = useMySaved();

  if (userLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userData?.user) {
    return <Navigate to="/login" replace />;
  }

  const hotels = savedData?.saved.map((s) => s.hotel).filter(Boolean) || [];

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-center">Saved Properties</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-12 border w-full sm:w-3xl px-4 rounded-2xl">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No saved properties yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the heart icon on any property to save it for later.
          </p>
          <Link to="/hotels" className="text-primary hover:underline mt-4 inline-block">
            Browse hotels
          </Link>
        </div>
      ) : (
        <HotelGrid hotels={hotels as NonNullable<typeof hotels[0]>[]} isLoading={false} />
      )}
    </div>
  );
}

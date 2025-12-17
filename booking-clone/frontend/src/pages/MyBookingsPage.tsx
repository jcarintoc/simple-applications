import { useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BookingCard } from "@/components/booking";
import { ReviewForm } from "@/components/reviews";
import { useMyBookings, useUser } from "@/lib/query";
import { Link, Navigate } from "react-router-dom";
import type { Booking } from "@/lib/api/types";

export function MyBookingsPage() {
  const { data: userData, isLoading: userLoading } = useUser();
  const { data: bookingsData, isLoading } = useMyBookings();
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

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

  const bookings = bookingsData?.bookings || [];
  const now = new Date();

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkInDate) >= now && b.status !== "cancelled"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.checkOutDate) < now || b.status === "cancelled"
  );

  const handleReview = (booking: Booking) => {
    setReviewBooking(booking);
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 border w-full sm:w-3xl px-4 rounded-2xl">
      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
      <Link to="/hotels" className="text-primary hover:underline mt-2 inline-block">
        Browse hotels
      </Link>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold text-center">My Bookings</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState message="You haven't made any bookings yet." />
      ) : (
        <Tabs defaultValue="upcoming" className="w-full sm:w-3xl">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingBookings.length === 0 ? (
              <EmptyState message="No upcoming bookings." />
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-4">
            {pastBookings.length === 0 ? (
              <EmptyState message="No past bookings." />
            ) : (
              pastBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onReview={handleReview}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {reviewBooking && reviewBooking.hotel && (
        <ReviewForm
          booking={reviewBooking}
          open={!!reviewBooking}
          onOpenChange={(open) => !open && setReviewBooking(null)}
        />
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMyBookings, useCancelBooking } from "@/lib/query/bookings";
import { Calendar, MapPin, X } from "lucide-react";

export function MyBookingsPage() {
  const { data: bookings, isLoading } = useMyBookings();
  const cancelBookingMutation = useCancelBooking();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);

  const handleCancelClick = (id: number) => {
    setBookingToCancel(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (bookingToCancel !== null) {
      cancelBookingMutation.mutate(bookingToCancel, {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setBookingToCancel(null);
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your bookings</p>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">
                      {booking.property_title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.property_location}</span>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  {booking.property_image_url && (
                    <img
                      src={booking.property_image_url}
                      alt={booking.property_title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Check-in</p>
                      <p className="text-muted-foreground">
                        {new Date(booking.check_in).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p className="text-muted-foreground">
                        {new Date(booking.check_out).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-xl font-bold">
                      ${booking.total_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link to={`/properties/${booking.property_id}`}>
                        View Property
                      </Link>
                    </Button>
                    {booking.status !== "cancelled" && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleCancelClick(booking.id)}
                          disabled={cancelBookingMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <AlertDialog
                          open={
                            cancelDialogOpen && bookingToCancel === booking.id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setCancelDialogOpen(false);
                              setBookingToCancel(null);
                            }
                          }}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will cancel
                                your booking for &quot;{booking.property_title}
                                &quot; from{" "}
                                {new Date(
                                  booking.check_in
                                ).toLocaleDateString()}{" "}
                                to{" "}
                                {new Date(
                                  booking.check_out
                                ).toLocaleDateString()}
                                .
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogAction
                                onClick={handleCancelConfirm}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Cancel Booking
                              </AlertDialogAction>
                              <AlertDialogCancel>
                                Keep Booking
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You don't have any bookings yet.
          </p>
          <Button asChild>
            <Link to="/">Browse Properties</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

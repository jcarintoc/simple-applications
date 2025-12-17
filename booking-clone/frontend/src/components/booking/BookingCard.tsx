import { format } from "date-fns";
import { Calendar, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCancelBooking } from "@/lib/query";
import type { Booking } from "@/lib/api/types";
import { Link } from "react-router-dom";

interface BookingCardProps {
  booking: Booking;
  onReview?: (booking: Booking) => void;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export function BookingCard({ booking, onReview }: BookingCardProps) {
  const cancelMutation = useCancelBooking();
  const hotel = booking.hotel;

  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const isPast = checkOut < new Date();
  const canCancel = booking.status === "confirmed" && !isPast;
  const canReview = isPast && booking.status !== "cancelled";

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {hotel && (
            <Link
              to={`/hotels/${hotel.id}`}
              className="md:w-48 shrink-0"
            >
              <img
                src={hotel.images[0] || "/placeholder.svg"}
                alt={hotel.name}
                className="h-48 w-full md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
            </Link>
          )}
          <div className="flex-1 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                {hotel && (
                  <Link
                    to={`/hotels/${hotel.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {hotel.name}
                  </Link>
                )}
                {hotel && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {hotel.city}, {hotel.country}
                  </div>
                )}
              </div>
              <Badge className={statusColors[booking.status] || ""}>
                {booking.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(checkIn, "MMM dd")} - {format(checkOut, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.guests} guest{booking.guests > 1 ? "s" : ""},{" "}
                  {booking.rooms} room{booking.rooms > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="font-semibold">${booking.totalPrice} total</div>
              <div className="flex gap-2">
                {canReview && onReview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReview(booking)}
                  >
                    Write Review
                  </Button>
                )}
                {canCancel && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={cancelMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this booking? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => cancelMutation.mutate(booking.id)}
                        >
                          Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateBooking } from "@/lib/query/bookings";
import { createBookingInputSchema, type CreateBookingInput } from "@/lib/api/types";
import { useUser } from "@/lib/query";
import type { PropertyWithOwner } from "@/lib/api/types";

interface BookingFormProps {
  property: PropertyWithOwner;
}

export function BookingForm({ property }: BookingFormProps) {
  const { data: userData } = useUser();
  const createBookingMutation = useCreateBooking();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingInputSchema),
    defaultValues: {
      property_id: property.id,
      check_in: "",
      check_out: "",
      guests: 1,
    },
  });

  const checkIn = watch("check_in");
  const checkOut = watch("check_out");
  const guests = watch("guests");

  // Calculate price when dates change
  React.useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate > checkInDate) {
        const nights = Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        setCalculatedPrice(nights * property.price_per_night);
      } else {
        setCalculatedPrice(null);
      }
    } else {
      setCalculatedPrice(null);
    }
  }, [checkIn, checkOut, property.price_per_night]);

  const onSubmit = (data: CreateBookingInput) => {
    if (!userData) {
      return;
    }

    createBookingMutation.mutate(
      { ...data, property_id: property.id },
      {
        onSuccess: () => {
          // Could show success message and navigate
        },
      }
    );
  };

  const today = new Date().toISOString().split("T")[0];
  const minCheckOut = checkIn || today;

  if (!userData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Book this property</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Please log in to book this property
          </p>
          <Button asChild className="w-full">
            <a href="/login">Login</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (userData.user.id === property.owner_id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Book this property</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You cannot book your own property
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="text-2xl font-bold">${property.price_per_night}</span>
          <span className="text-base font-normal text-muted-foreground"> / night</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="check_in">Check-in</Label>
            <Input
              id="check_in"
              type="date"
              min={today}
              {...register("check_in")}
              className={errors.check_in ? "border-destructive" : ""}
            />
            {errors.check_in && (
              <p className="text-sm text-destructive mt-1">{errors.check_in.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="check_out">Check-out</Label>
            <Input
              id="check_out"
              type="date"
              min={minCheckOut}
              {...register("check_out")}
              className={errors.check_out ? "border-destructive" : ""}
            />
            {errors.check_out && (
              <p className="text-sm text-destructive mt-1">{errors.check_out.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="guests">Guests</Label>
            <Input
              id="guests"
              type="number"
              min={1}
              max={property.max_guests}
              {...register("guests", { valueAsNumber: true })}
              className={errors.guests ? "border-destructive" : ""}
            />
            {errors.guests && (
              <p className="text-sm text-destructive mt-1">{errors.guests.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Maximum {property.max_guests} {property.max_guests === 1 ? "guest" : "guests"}
            </p>
          </div>

          {calculatedPrice !== null && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>${property.price_per_night} x {Math.ceil(
                  (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
                )} nights</span>
                <span>${calculatedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${calculatedPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={createBookingMutation.isPending}>
            {createBookingMutation.isPending ? "Booking..." : "Book Now"}
          </Button>

          {createBookingMutation.isError && (
            <p className="text-sm text-destructive text-center">
              {createBookingMutation.error instanceof Error
                ? createBookingMutation.error.message
                : "Failed to create booking"}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

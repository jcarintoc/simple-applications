import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInDays } from "date-fns";
import { Calendar, Users, BedDouble } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateBooking, useCsrfToken, useUser } from "@/lib/query";
import { cn } from "@/lib/utils";
import type { Hotel, UserResponse } from "@/lib/api/types";
import { useNavigate } from "react-router-dom";

const bookingFormSchema = z.object({
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1).max(10),
  rooms: z.number().min(1).max(5),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  hotel: Hotel;
}

export function BookingForm({ hotel }: BookingFormProps) {
  const navigate = useNavigate();
  const { data: userResponse } = useUser();
  const userData = userResponse as UserResponse | undefined;
  const { refetch: refetchCsrf } = useCsrfToken();
  const createBooking = useCreateBooking();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: 1,
      rooms: 1,
    },
  });

  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");
  const rooms = form.watch("rooms");

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = nights * hotel.pricePerNight * rooms;

  const onSubmit = async (data: BookingFormData) => {
    if (!userData?.user) {
      navigate("/login");
      return;
    }

    setError(null);

    try {
      const { data: csrfData } = await refetchCsrf();
      if (!csrfData?.csrfToken) {
        setError("Failed to get security token. Please try again.");
        return;
      }

      createBooking.mutate(
        {
          hotelId: hotel.id,
          checkInDate: format(data.checkIn, "yyyy-MM-dd"),
          checkOutDate: format(data.checkOut, "yyyy-MM-dd"),
          guests: data.guests,
          rooms: data.rooms,
          csrfToken: csrfData.csrfToken,
        },
        {
          onError: (err) => {
            setError(err instanceof Error ? err.message : "Booking failed");
          },
        }
      );
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="p-4 gap-4">
      <CardHeader className="p-0">
        <CardTitle className="flex items-baseline gap-2">
          <span className="text-2xl">${hotel.pricePerNight}</span>
          <span className="text-sm font-normal text-muted-foreground">
            / night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="h-4 w-4" />
                            {field.value
                              ? format(field.value, "MMM dd")
                              : "Select"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="h-4 w-4" />
                            {field.value
                              ? format(field.value, "MMM dd")
                              : "Select"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const checkInDate = form.getValues("checkIn");
                            return (
                              date < new Date() ||
                              (checkInDate && date <= checkInDate)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guests</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          className="pl-10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rooms</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BedDouble className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          className="pl-10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {nights > 0 && (
              <>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      ${hotel.pricePerNight} x {nights} night
                      {nights > 1 ? "s" : ""} x {rooms} room{rooms > 1 ? "s" : ""}
                    </span>
                    <span>${totalPrice}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={createBooking.isPending || nights <= 0}
            >
              {createBooking.isPending
                ? "Booking..."
                : userData?.user
                ? "Reserve"
                : "Sign in to book"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

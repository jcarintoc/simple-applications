import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { MapPin, Calendar, Users, Search } from "lucide-react";
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
import { searchFormSchema, type SearchFormInput } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  variant?: "hero" | "compact";
  defaultValues?: Partial<SearchFormInput>;
  onSearch?: (data: SearchFormInput) => void;
}

export function SearchForm({
  variant = "hero",
  defaultValues,
  onSearch,
}: SearchFormProps) {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: defaultValues?.location || "",
      checkIn: defaultValues?.checkIn || undefined,
      checkOut: defaultValues?.checkOut || undefined,
      guests: defaultValues?.guests || 1,
      rooms: defaultValues?.rooms || 1,
    },
  });

  const onSubmit = (data: SearchFormInput) => {
    if (onSearch) {
      onSearch(data);
      return;
    }

    const params = new URLSearchParams();
    params.set("location", data.location);
    if (data.checkIn) params.set("checkIn", format(data.checkIn, "yyyy-MM-dd"));
    if (data.checkOut)
      params.set("checkOut", format(data.checkOut, "yyyy-MM-dd"));
    params.set("guests", data.guests.toString());
    params.set("rooms", data.rooms.toString());

    navigate(`/hotels?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "rounded-lg bg-background shadow-lg border mt-8",
          isHero ? "p-6" : "p-4"
        )}
      >
        <div
          className={cn(
            "grid gap-4",
            isHero
              ? "md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
              : "md:grid-cols-[2fr_1fr_1fr_auto]"
          )}
        >
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                {isHero && <FormLabel>Destination</FormLabel>}
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Where are you going?"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                {isHero && <FormLabel>Check-in</FormLabel>}
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
                          : "Check-in"}
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
                {isHero && <FormLabel>Check-out</FormLabel>}
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
                          : "Check-out"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const checkIn = form.getValues("checkIn");
                        return date < new Date() || (checkIn ? date <= checkIn : false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {isHero && (
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
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" size={isHero ? "default" : "default"} className={cn(isHero && "mt-auto")}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}

import { EventCard } from "./EventCard";
import { CalendarX } from "lucide-react";
import type { Event } from "@/lib/api";

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  isLoading?: boolean;
}

export function EventList({ events, onEdit, onDelete, isLoading }: EventListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-32 rounded-lg border bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CalendarX className="size-16 text-muted-foreground/40 mb-4" />
        <h3 className="font-semibold text-lg mb-1">No events found</h3>
        <p className="text-sm text-muted-foreground">
          Create your first event to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

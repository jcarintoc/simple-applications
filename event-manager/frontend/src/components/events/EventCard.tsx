import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventTagBadge } from "./EventTagBadge";
import { MoreVertical, Pencil, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event, EventTag } from "@/lib/api";
import { tagConfig } from "./EventTagBadge";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDateBlock(dateString: string): { month: string; day: string } {
  const date = new Date(dateString + "T00:00:00");
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
  };
}

const tagAccentColors: Record<EventTag, string> = {
  work: "bg-blue-50/50 dark:bg-blue-950/20",
  personal: "bg-green-50/50 dark:bg-green-950/20",
  urgent: "bg-red-50/50 dark:bg-red-950/20",
};

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const dateBlock = getDateBlock(event.date);
  const accentClass = tagAccentColors[event.tag];

  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:shadow-md p-0 group",
        accentClass
      )}
    >
      <CardContent className="p-0 m-0">
        <div className="flex gap-4 p-3 relative">
          {/* Date Block */}
          <div className="shrink-0 relative -top-8 group-hover:top-0 transition-all duration-200">
            <div
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-white border shadow-sm",
                tagConfig[event.tag as EventTag].className
              )}
            >
              <div className="text-xs font-semibold leading-tight">
                {dateBlock.month}
              </div>
              <div className="text-2xl font-bold leading-none mt-0.5">
                {dateBlock.day}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-col items-start gap-2">
                  <EventTagBadge tag={event.tag} />
                  <h3 className="font-semibold text-base leading-tight">
                    {event.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                  <span className="text-muted-foreground/60">•</span>
                  <span>{formatDate(event.date)}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="transition-opacity h-8 w-8"
                  >
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(event)}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(event)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

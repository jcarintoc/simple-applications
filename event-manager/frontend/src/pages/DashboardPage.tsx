import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EventFilters,
  EventList,
  EventFormDialog,
  DeleteEventDialog,
  EventPagination,
} from "@/components/events";
import {
  useUser,
  useLogout,
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/lib/query";
import { Plus, LogOut, Calendar, Sparkles } from "lucide-react";
import type { Event, EventFilter, CreateEventInput } from "@/lib/api";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function DashboardPage() {
  const { data: userData, isLoading: isUserLoading } = useUser();
  const logoutMutation = useLogout();

  // Event state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EventFilter>("all");
  const [page, setPage] = useState(1);

  // Dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Debounced search for better UX
  const debouncedSearch = useDebounce(search, 300);

  // Event queries
  const { data: eventsData, isLoading: isEventsLoading } = useEvents({
    search: debouncedSearch || undefined,
    filter,
    page,
    limit: 10,
  });

  // Mutations
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCreateClick = () => {
    setSelectedEvent(null);
    setFormDialogOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateEventInput) => {
    if (selectedEvent) {
      updateMutation.mutate(
        { id: selectedEvent.id, data },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
            setSelectedEvent(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormDialogOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedEvent) {
      deleteMutation.mutate(selectedEvent.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedEvent(null);
        },
      });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (value: EventFilter) => {
    setFilter(value);
    setPage(1);
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const user = userData?.user;
  const events = eventsData?.events ?? [];
  const pagination = eventsData?.pagination;

  // Get greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Format current date
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  // Count upcoming events
  const eventCount = events.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10">
                <Calendar className="size-5 text-primary" />
              </div>
              <h1 className="text-xl font-semibold">Event Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut />
                <span className="hidden sm:inline">
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {greeting}, {user?.name?.split(" ")[0]}!
              </h2>
              <p className="text-muted-foreground mt-1.5">{currentDate}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm font-medium px-3 py-1.5">
                  <Sparkles className="size-3.5" />
                  <span className="ml-1.5">
                    {eventCount} {eventCount === 1 ? "event" : "events"} upcoming
                  </span>
                </Badge>
              </div>
              <Button onClick={handleCreateClick} size="lg" className="shadow-sm">
                <Plus />
                New Event
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card/50 rounded-lg border p-4">
            <EventFilters
              search={search}
              onSearchChange={handleSearchChange}
              filter={filter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Event List */}
          <EventList
            events={events}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isLoading={isEventsLoading}
          />

          {/* Pagination */}
          {pagination && (
            <EventPagination pagination={pagination} onPageChange={setPage} />
          )}
        </div>
      </main>

      {/* Dialogs */}
      <EventFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        event={selectedEvent}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteEventDialog
        event={selectedEvent}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

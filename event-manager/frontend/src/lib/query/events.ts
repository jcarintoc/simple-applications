import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  eventsApi,
  type CreateEventInput,
  type UpdateEventInput,
  type EventQueryParams,
} from "../api";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (params?: EventQueryParams) => [...eventKeys.lists(), params] as const,
};

export function useEvents(params?: EventQueryParams) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventsApi.getEvents(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventInput) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventInput }) =>
      eventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

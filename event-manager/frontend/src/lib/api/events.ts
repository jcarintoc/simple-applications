import { apiClient } from "./client";
import {
  type CreateEventInput,
  type UpdateEventInput,
  type PaginatedEventsResponse,
  type EventMutationResponse,
  type EventQueryParams,
  paginatedEventsResponseSchema,
  eventMutationResponseSchema,
} from "./types";

export const eventsApi = {
  getEvents: async (params?: EventQueryParams): Promise<PaginatedEventsResponse> => {
    const response = await apiClient.get<PaginatedEventsResponse>("/events", {
      params: {
        search: params?.search || undefined,
        filter: params?.filter || undefined,
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    });
    return paginatedEventsResponseSchema.parse(response.data);
  },

  createEvent: async (data: CreateEventInput): Promise<EventMutationResponse> => {
    const response = await apiClient.post<EventMutationResponse>("/events", data);
    return eventMutationResponseSchema.parse(response.data);
  },

  updateEvent: async (
    id: number,
    data: UpdateEventInput
  ): Promise<EventMutationResponse> => {
    const response = await apiClient.put<EventMutationResponse>(`/events/${id}`, data);
    return eventMutationResponseSchema.parse(response.data);
  },

  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/${id}`, {
      headers: {
        "X-CSRF-Protection": "1",
      },
    });
  },
};

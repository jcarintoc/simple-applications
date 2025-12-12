import { eventRepository } from "../repositories/index.js";
import type {
  Event,
  EventResponse,
  CreateEventDto,
  UpdateEventDto,
  EventFilterParams,
  PaginatedEventsResponse,
} from "../types/index.js";

function toEventResponse(event: Event): EventResponse {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    description: event.description,
    tag: event.tag,
    created_at: event.created_at,
    updated_at: event.updated_at,
  };
}

export const eventService = {
  createEvent(userId: number, data: CreateEventDto): EventResponse {
    const event = eventRepository.create(userId, data);
    return toEventResponse(event);
  },

  getEventById(id: number, userId: number): EventResponse | null {
    const event = eventRepository.findById(id, userId);
    return event ? toEventResponse(event) : null;
  },

  getEvents(userId: number, params: EventFilterParams): PaginatedEventsResponse {
    const { events, total } = eventRepository.findByUser(userId, params);
    const page = params.page || 1;
    const limit = params.limit || 10;

    return {
      events: events.map(toEventResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  updateEvent(
    id: number,
    userId: number,
    data: UpdateEventDto
  ): EventResponse | null {
    const event = eventRepository.update(id, userId, data);
    return event ? toEventResponse(event) : null;
  },

  deleteEvent(id: number, userId: number): boolean {
    return eventRepository.delete(id, userId);
  },
};

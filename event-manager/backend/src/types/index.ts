export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: number;
}

// Event types
export type EventTag = "work" | "personal" | "urgent";

export interface Event {
  id: number;
  user_id: number;
  title: string;
  date: string;
  time: string;
  description: string | null;
  tag: EventTag;
  created_at: string;
  updated_at: string;
}

export interface EventResponse {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string | null;
  tag: EventTag;
  created_at: string;
  updated_at: string;
}

export interface CreateEventDto {
  title: string;
  date: string;
  time: string;
  description?: string;
  tag: EventTag;
}

export interface UpdateEventDto {
  title?: string;
  date?: string;
  time?: string;
  description?: string;
  tag?: EventTag;
}

export interface EventFilterParams {
  search?: string;
  filter?: "today" | "week" | "all";
  page?: number;
  limit?: number;
}

export interface PaginatedEventsResponse {
  events: EventResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

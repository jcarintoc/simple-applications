import { z } from "zod";

// Zod Schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const authResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const userResponseSchema = z.object({
  user: userSchema,
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

// Event Schemas
export const eventTagSchema = z.enum(["work", "personal", "urgent"]);

export const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  date: z.string(),
  time: z.string(),
  description: z.string().nullable(),
  tag: eventTagSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  description: z.string().optional(),
  tag: eventTagSchema,
});

export const updateEventSchema = createEventSchema.partial();

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const paginatedEventsResponseSchema = z.object({
  events: z.array(eventSchema),
  pagination: paginationSchema,
});

export const eventResponseSchema = z.object({
  event: eventSchema,
});

export const eventMutationResponseSchema = z.object({
  message: z.string(),
  event: eventSchema,
});

export const eventFilterSchema = z.enum(["today", "week", "all"]);

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Event Types
export type EventTag = z.infer<typeof eventTagSchema>;
export type Event = z.infer<typeof eventSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type PaginatedEventsResponse = z.infer<typeof paginatedEventsResponseSchema>;
export type EventResponse = z.infer<typeof eventResponseSchema>;
export type EventMutationResponse = z.infer<typeof eventMutationResponseSchema>;
export type EventFilter = z.infer<typeof eventFilterSchema>;

export interface EventQueryParams {
  search?: string;
  filter?: EventFilter;
  page?: number;
  limit?: number;
}

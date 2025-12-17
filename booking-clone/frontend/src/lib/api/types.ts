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

// Hotel schemas
export const hotelSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  city: z.string(),
  country: z.string(),
  address: z.string(),
  pricePerNight: z.number(),
  rating: z.number(),
  reviewCount: z.number(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  roomsAvailable: z.number(),
});

export const hotelSearchResponseSchema = z.object({
  hotels: z.array(hotelSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const hotelDetailResponseSchema = z.object({
  hotel: hotelSchema,
});

export const featuredHotelsResponseSchema = z.object({
  hotels: z.array(hotelSchema),
});

// Booking schemas
export const bookingSchema = z.object({
  id: z.number(),
  hotelId: z.number(),
  hotel: hotelSchema.optional(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  guests: z.number(),
  rooms: z.number(),
  totalPrice: z.number(),
  status: z.string(),
  createdAt: z.string(),
});

export const createBookingSchema = z.object({
  hotelId: z.number(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  guests: z.number().min(1),
  rooms: z.number().min(1),
  csrfToken: z.string(),
});

export const bookingsResponseSchema = z.object({
  bookings: z.array(bookingSchema),
});

export const bookingCreateResponseSchema = z.object({
  message: z.string(),
  booking: bookingSchema,
});

// Review schemas
export const reviewSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userName: z.string(),
  hotelId: z.number(),
  bookingId: z.number(),
  rating: z.number(),
  title: z.string(),
  comment: z.string(),
  createdAt: z.string(),
});

export const createReviewSchema = z.object({
  hotelId: z.number(),
  bookingId: z.number(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  csrfToken: z.string(),
});

export const reviewsResponseSchema = z.object({
  reviews: z.array(reviewSchema),
});

// Saved property schemas
export const savedPropertySchema = z.object({
  id: z.number(),
  hotel: hotelSchema,
  savedAt: z.string(),
});

export const savedResponseSchema = z.object({
  saved: z.array(savedPropertySchema),
});

export const savedCheckResponseSchema = z.object({
  saved: z.boolean(),
});

export const savedToggleResponseSchema = z.object({
  saved: z.boolean(),
});

// CSRF schema
export const csrfResponseSchema = z.object({
  csrfToken: z.string(),
});

// Search form schema
export const searchFormSchema = z.object({
  location: z.string().min(1, "Location is required"),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  guests: z.number().min(1).default(1),
  rooms: z.number().min(1).default(1),
});

// Search params for API
export interface SearchParams {
  location?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  limit?: number;
  page?: number;
}

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Hotel types
export type Hotel = z.infer<typeof hotelSchema>;
export type HotelSearchResponse = z.infer<typeof hotelSearchResponseSchema>;
export type HotelDetailResponse = z.infer<typeof hotelDetailResponseSchema>;
export type FeaturedHotelsResponse = z.infer<typeof featuredHotelsResponseSchema>;

// Booking types
export type Booking = z.infer<typeof bookingSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingsResponse = z.infer<typeof bookingsResponseSchema>;

// Review types
export type Review = z.infer<typeof reviewSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;

// Saved types
export type SavedProperty = z.infer<typeof savedPropertySchema>;
export type SavedResponse = z.infer<typeof savedResponseSchema>;

// Search types
export type SearchFormInput = z.infer<typeof searchFormSchema>;

// CSRF types
export type CsrfResponse = z.infer<typeof csrfResponseSchema>;

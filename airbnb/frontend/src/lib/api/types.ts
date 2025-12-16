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

// Property schemas
export const propertySchema = z.object({
  id: z.number(),
  owner_id: z.number(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  price_per_night: z.number(),
  max_guests: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  amenities: z.string().nullable(),
  image_url: z.string().nullable(),
  created_at: z.string(),
});

export const propertyWithOwnerSchema = propertySchema.extend({
  owner_name: z.string(),
  owner_email: z.string(),
});

export const createPropertyInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  price_per_night: z.number().positive(),
  max_guests: z.number().int().positive(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  amenities: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
});

export const updatePropertyInputSchema = createPropertyInputSchema.partial();

export const propertiesResponseSchema = z.object({
  properties: z.array(propertyWithOwnerSchema),
});

export const propertyResponseSchema = z.object({
  property: propertyWithOwnerSchema,
});

// Booking schemas
export const bookingSchema = z.object({
  id: z.number(),
  property_id: z.number(),
  guest_id: z.number(),
  check_in: z.string(),
  check_out: z.string(),
  total_price: z.number(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  created_at: z.string(),
});

export const bookingWithPropertySchema = bookingSchema.extend({
  property_title: z.string(),
  property_location: z.string(),
  property_image_url: z.string().nullable(),
});

export const createBookingInputSchema = z.object({
  property_id: z.number(),
  check_in: z.string(),
  check_out: z.string(),
  guests: z.number().int().positive(),
});

export const bookingsResponseSchema = z.object({
  bookings: z.array(bookingWithPropertySchema),
});

export const bookingResponseSchema = z.object({
  booking: bookingSchema,
});

// Review schemas
export const reviewSchema = z.object({
  id: z.number(),
  property_id: z.number(),
  user_id: z.number(),
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  created_at: z.string(),
});

export const reviewWithUserSchema = reviewSchema.extend({
  user_name: z.string(),
  user_email: z.string(),
});

export const createReviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export const reviewsResponseSchema = z.object({
  reviews: z.array(reviewWithUserSchema),
});

export const reviewResponseSchema = z.object({
  review: reviewSchema,
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type Property = z.infer<typeof propertySchema>;
export type PropertyWithOwner = z.infer<typeof propertyWithOwnerSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertyInputSchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertyInputSchema>;

export type Booking = z.infer<typeof bookingSchema>;
export type BookingWithProperty = z.infer<typeof bookingWithPropertySchema>;
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

export type Review = z.infer<typeof reviewSchema>;
export type ReviewWithUser = z.infer<typeof reviewWithUserSchema>;
export type CreateReviewInput = z.infer<typeof createReviewInputSchema>;

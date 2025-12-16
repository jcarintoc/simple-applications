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

// Profile Schemas
export const profileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  headline: z.string().nullable(),
  summary: z.string().nullable(),
  location: z.string().nullable(),
  industry: z.string().nullable(),
  profile_image_url: z.string().nullable(),
  banner_image_url: z.string().nullable(),
  user: userSchema,
});

export const updateProfileSchema = z.object({
  headline: z.string().max(120).optional(),
  summary: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  profile_image_url: z.string().url().optional(),
  banner_image_url: z.string().url().optional(),
});

export const suggestedUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  headline: z.string().nullable(),
  profile_image_url: z.string().nullable(),
});

// Connection Schemas
export const connectionResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  headline: z.string().nullable(),
  profile_image_url: z.string().nullable(),
  connected_at: z.string(),
});

export const connectionRequestSchema = z.object({
  id: z.number(),
  requester_id: z.number(),
  requester_name: z.string(),
  requester_headline: z.string().nullable(),
  requester_profile_image_url: z.string().nullable(),
  created_at: z.string(),
});

export const connectionStatusSchema = z.object({
  status: z.enum(["none", "pending_sent", "pending_received", "connected", "self"]),
  connection_id: z.number().optional(),
});

// Job Schemas
export const jobPostSchema = z.object({
  id: z.number(),
  company_name: z.string(),
  job_title: z.string(),
  description: z.string(),
  location: z.string().nullable(),
  employment_type: z.enum(["full-time", "part-time", "contract", "internship"]).nullable(),
  experience_level: z.enum(["entry", "mid", "senior", "executive"]).nullable(),
  posted_by_user_id: z.number().nullable(),
  created_at: z.string(),
  has_applied: z.boolean(),
});

export const jobApplicationSchema = z.object({
  cover_letter: z.string().max(1000).optional(),
});

export const jobApplicationResponseSchema = z.object({
  id: z.number(),
  job_post_id: z.number(),
  job_title: z.string(),
  company_name: z.string(),
  status: z.string(),
  created_at: z.string(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SuggestedUser = z.infer<typeof suggestedUserSchema>;
export type ConnectionResponse = z.infer<typeof connectionResponseSchema>;
export type ConnectionRequest = z.infer<typeof connectionRequestSchema>;
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;
export type JobPost = z.infer<typeof jobPostSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type JobApplicationResponse = z.infer<typeof jobApplicationResponseSchema>;

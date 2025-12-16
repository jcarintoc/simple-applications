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

// Email schemas
export const emailSchema = z.object({
  id: z.number(),
  from_user_id: z.number(),
  to_user_id: z.number(),
  subject: z.string(),
  body: z.string(),
  is_read: z.number(),
  is_archived: z.number().optional(),
  archived_by_sender: z.number().optional(),
  archived_by_recipient: z.number().optional(),
  is_deleted: z.number(),
  created_at: z.string(),
  from_user_name: z.string(),
  from_user_email: z.string(),
  to_user_name: z.string(),
  to_user_email: z.string(),
});

export const emailsResponseSchema = z.object({
  emails: z.array(emailSchema),
});

export const emailResponseSchema = z.object({
  email: emailSchema,
});

export const sendEmailInputSchema = z.object({
  to_email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export const unreadCountResponseSchema = z.object({
  count: z.number(),
});

export const usersSearchResponseSchema = z.object({
  users: z.array(userSchema),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type Email = z.infer<typeof emailSchema>;
export type SendEmailInput = z.infer<typeof sendEmailInputSchema>;
export type EmailFolder = "inbox" | "sent" | "archive" | "trash";

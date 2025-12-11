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

// Survey schemas
export const surveySchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()),
  created_at: z.string(),
  author_name: z.string(),
  response_count: z.number(),
});

export const surveyResultSchema = z.object({
  option: z.string(),
  count: z.number(),
  percentage: z.number(),
});

export const surveyWithResultsSchema = surveySchema.extend({
  results: z.array(surveyResultSchema),
});

export const createSurveySchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required").max(6, "Maximum 6 options allowed"),
});

export const submitResponseSchema = z.object({
  selected_option: z.number().min(0, "Please select an option"),
});

export const surveysResponseSchema = z.object({
  surveys: z.array(surveySchema),
});

export const surveyResponseSchema = z.object({
  survey: surveySchema,
});

export const surveyResultsResponseSchema = z.object({
  survey: surveyWithResultsSchema,
});

export const csrfTokenResponseSchema = z.object({
  csrfToken: z.string(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type Survey = z.infer<typeof surveySchema>;
export type SurveyResult = z.infer<typeof surveyResultSchema>;
export type SurveyWithResults = z.infer<typeof surveyWithResultsSchema>;
export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
export type SurveysResponse = z.infer<typeof surveysResponseSchema>;
export type SurveyResponse = z.infer<typeof surveyResponseSchema>;
export type SurveyResultsResponse = z.infer<typeof surveyResultsResponseSchema>;
export type CSRFTokenResponse = z.infer<typeof csrfTokenResponseSchema>;

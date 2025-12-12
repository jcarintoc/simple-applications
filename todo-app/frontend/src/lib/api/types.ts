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

// Todo Schemas
export const todoStatusEnum = z.enum(["pending", "in_progress", "completed"]);
export const todoPriorityEnum = z.enum(["low", "medium", "high"]);

export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: todoStatusEnum,
  priority: todoPriorityEnum,
  due_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  status: todoStatusEnum.optional(),
  priority: todoPriorityEnum.optional(),
  due_date: z.string().optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  description: z.string().max(1000, "Description is too long").optional(),
  status: todoStatusEnum.optional(),
  priority: todoPriorityEnum.optional(),
  due_date: z.string().optional().nullable(),
});

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const todoListResponseSchema = z.object({
  data: z.array(todoSchema),
  pagination: paginationSchema,
});

export const todoFiltersSchema = z.object({
  status: todoStatusEnum.optional(),
  priority: todoPriorityEnum.optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type TodoStatus = z.infer<typeof todoStatusEnum>;
export type TodoPriority = z.infer<typeof todoPriorityEnum>;
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type TodoListResponse = z.infer<typeof todoListResponseSchema>;
export type TodoFilters = z.infer<typeof todoFiltersSchema>;

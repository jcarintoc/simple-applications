import { z } from "zod";

export const todoStatusEnum = z.enum(["pending", "in_progress", "completed"]);
export const todoPriorityEnum = z.enum(["low", "medium", "high"]);

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  status: todoStatusEnum.optional().default("pending"),
  priority: todoPriorityEnum.optional().default("medium"),
  due_date: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      // Validate it's a valid datetime
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return val;
    }),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  description: z.string().max(1000, "Description is too long").optional(),
  status: todoStatusEnum.optional(),
  priority: todoPriorityEnum.optional(),
  due_date: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      // If undefined, don't update the field at all
      if (val === undefined) return undefined;
      // If empty string or null, clear the field
      if (!val || val === "") return null;
      // Validate it's a valid datetime
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      return val;
    }),
});

export const todoFiltersSchema = z.object({
  status: todoStatusEnum.optional(),
  priority: todoPriorityEnum.optional(),
  search: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoFiltersInput = z.infer<typeof todoFiltersSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

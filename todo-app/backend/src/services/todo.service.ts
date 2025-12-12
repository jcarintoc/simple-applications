import { todoRepository } from "../repositories/index.js";
import type { Todo, TodoResponse, PaginatedResponse, TodoFilters, PaginationParams } from "../types/index.js";
import {
  createTodoSchema,
  updateTodoSchema,
  todoFiltersSchema,
  paginationSchema,
  type CreateTodoInput,
  type UpdateTodoInput,
} from "../validators/todo.validator.js";
import { ZodError } from "zod";

export class TodoService {
  private mapToResponse(todo: Todo): TodoResponse {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      due_date: todo.due_date,
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    };
  }

  async getTodos(
    userId: number,
    filters: unknown,
    pagination: unknown
  ): Promise<PaginatedResponse<TodoResponse>> {
    try {
      // Validate filters and pagination
      const validatedFilters = todoFiltersSchema.parse(filters);
      const validatedPagination = paginationSchema.parse(pagination);

      const { todos, total } = todoRepository.findAll(
        userId,
        validatedFilters as TodoFilters,
        validatedPagination as PaginationParams
      );

      return {
        data: todos.map(this.mapToResponse),
        pagination: {
          page: validatedPagination.page,
          limit: validatedPagination.limit,
          total,
          totalPages: Math.ceil(total / validatedPagination.limit),
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }

  async getTodoById(id: number, userId: number): Promise<TodoResponse> {
    const todo = todoRepository.findById(id, userId);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return this.mapToResponse(todo);
  }

  async createTodo(userId: number, data: unknown): Promise<TodoResponse> {
    try {
      const validatedData = createTodoSchema.parse(data) as CreateTodoInput;
      const todo = todoRepository.create(userId, validatedData);
      return this.mapToResponse(todo);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }

  async updateTodo(id: number, userId: number, data: unknown): Promise<TodoResponse> {
    try {
      const validatedData = updateTodoSchema.parse(data) as UpdateTodoInput;
      const todo = todoRepository.update(id, userId, validatedData);
      if (!todo) {
        throw new Error("Todo not found");
      }
      return this.mapToResponse(todo);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Validation error: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }

  async deleteTodo(id: number, userId: number): Promise<void> {
    const deleted = todoRepository.delete(id, userId);
    if (!deleted) {
      throw new Error("Todo not found");
    }
  }

  async deleteAllTodos(userId: number): Promise<number> {
    return todoRepository.deleteAll(userId);
  }
}

export const todoService = new TodoService();

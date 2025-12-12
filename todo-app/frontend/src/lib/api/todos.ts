import { apiClient } from "./client";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoListResponse,
  TodoFilters,
} from "./types";

export const todosApi = {
  getTodos: async (filters?: TodoFilters): Promise<TodoListResponse> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<TodoListResponse>(
      `/todos?${params.toString()}`
    );
    return response.data;
  },

  getTodoById: async (id: number): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (data: CreateTodoInput): Promise<Todo> => {
    const response = await apiClient.post<Todo>("/todos", data);
    return response.data;
  },

  updateTodo: async (id: number, data: UpdateTodoInput): Promise<Todo> => {
    const response = await apiClient.put<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },

  deleteAllTodos: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>("/todos");
    return response.data;
  },
};

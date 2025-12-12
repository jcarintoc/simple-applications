import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { todosApi } from "../api";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoListResponse,
  TodoFilters,
} from "../api/types";

export const TODO_KEYS = {
  all: ["todos"] as const,
  lists: () => [...TODO_KEYS.all, "list"] as const,
  list: (filters?: TodoFilters) => [...TODO_KEYS.lists(), filters] as const,
  details: () => [...TODO_KEYS.all, "detail"] as const,
  detail: (id: number) => [...TODO_KEYS.details(), id] as const,
};

export function useTodos(
  filters?: TodoFilters
): UseQueryResult<TodoListResponse, Error> {
  return useQuery({
    queryKey: TODO_KEYS.list(filters),
    queryFn: () => todosApi.getTodos(filters),
  });
}

export function useTodo(id: number): UseQueryResult<Todo, Error> {
  return useQuery({
    queryKey: TODO_KEYS.detail(id),
    queryFn: () => todosApi.getTodoById(id),
    enabled: !!id,
  });
}

export function useCreateTodo(): UseMutationResult<
  Todo,
  Error,
  CreateTodoInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoInput) => todosApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
    },
  });
}

export function useUpdateTodo(): UseMutationResult<
  Todo,
  Error,
  { id: number; data: UpdateTodoInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoInput }) =>
      todosApi.updateTodo(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.detail(data.id) });
    },
  });
}

export function useDeleteTodo(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todosApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
    },
  });
}

export function useDeleteAllTodos(): UseMutationResult<
  { message: string },
  Error,
  void
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => todosApi.deleteAllTodos(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
    },
  });
}

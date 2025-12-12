import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Inbox } from "lucide-react";
import { TodoCard } from "./TodoCard";
import { TodoForm } from "./TodoForm";
import { TodoFiltersComponent } from "./TodoFilters";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "@/lib/query";
import type { CreateTodoInput, TodoFilters, TodoStatus } from "@/lib/api";

const COLUMNS = [
  { id: "pending", title: "To Do", status: "pending" as TodoStatus },
  { id: "in_progress", title: "In Progress", status: "in_progress" as TodoStatus },
  { id: "completed", title: "Done", status: "completed" as TodoStatus },
] as const;

const getColumnBgColor = (status: TodoStatus): string => {
  switch (status) {
    case "pending":
      return "bg-gray-100";
    case "in_progress":
      return "bg-blue-400/10";
    case "completed":
      return "bg-red-400/10";
    default:
      return "bg-muted/30";
  }
};

export function TodoList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState<TodoFilters>({
    page: 1,
    limit: 50,
  });

  const { data, isLoading } = useTodos(filters);
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const todosByStatus = useMemo(() => {
    if (!data?.data) {
      return {
        pending: [],
        in_progress: [],
        completed: [],
      };
    }

    return {
      pending: data.data.filter((todo) => todo.status === "pending"),
      in_progress: data.data.filter((todo) => todo.status === "in_progress"),
      completed: data.data.filter((todo) => todo.status === "completed"),
    };
  }, [data?.data]);

  const handleCreateTodo = (todoData: CreateTodoInput) => {
    createMutation.mutate(todoData, {
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });
  };

  const handleUpdateStatus = (id: number, status: TodoStatus) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleDeleteTodo = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <TodoFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TodoForm
              onSubmit={handleCreateTodo}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Loading tasks...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const todos = todosByStatus[column.status];
            const columnIndex = COLUMNS.findIndex((c) => c.id === column.id);

            return (
              <div
                key={column.id}
                className={`flex flex-col h-full min-h-[75vh] ${getColumnBgColor(column.status)} rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <span className="text-xs border bg-background px-2 py-0.5 rounded-full">
                      {todos.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                  {todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Inbox className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No tasks here
                      </p>
                    </div>
                  ) : (
                    todos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onUpdate={handleUpdateStatus}
                        onDelete={handleDeleteTodo}
                        canMoveLeft={columnIndex > 0}
                        canMoveRight={columnIndex < COLUMNS.length - 1}
                        isUpdating={updateMutation.isPending}
                        isDeleting={deleteMutation.isPending}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (data.pagination.page > 1) {
                  setFilters({ ...filters, page: (filters.page || 1) - 1 });
                }
              }}
              disabled={data.pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (data.pagination.page < data.pagination.totalPages) {
                  setFilters({ ...filters, page: (filters.page || 1) + 1 });
                }
              }}
              disabled={data.pagination.page === data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

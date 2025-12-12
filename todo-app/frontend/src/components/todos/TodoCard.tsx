import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import type { Todo, TodoStatus } from "@/lib/api";
import { TodoEditDialog } from "./TodoEditDialog";

interface TodoCardProps {
  todo: Todo;
  onUpdate: (id: number, status: TodoStatus) => void;
  onDelete: (id: number) => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const getCardBgColor = (status: TodoStatus): string => {
  switch (status) {
    case "pending":
      return "bg-gray-400";
    case "in_progress":
      return "bg-blue-400";
    case "completed":
      return "bg-red-400";
    default:
      return "bg-border";
  }
};

const priorityColors: Record<Todo["priority"], string> = {
  low: "bg-blue-500/10 text-blue-700 border-blue-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
};

const priorityLabels: Record<Todo["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function TodoCard({
  todo,
  onUpdate,
  onDelete,
  canMoveLeft,
  canMoveRight,
  isUpdating,
  isDeleting,
}: TodoCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isCompleted = todo.status === "completed";

  const handleToggleComplete = () => {
    const newStatus: TodoStatus = isCompleted ? "pending" : "completed";
    onUpdate(todo.id, newStatus);
  };

  const handleMoveLeft = () => {
    if (todo.status === "in_progress") {
      onUpdate(todo.id, "pending");
    } else if (todo.status === "completed") {
      onUpdate(todo.id, "in_progress");
    }
  };

  const handleMoveRight = () => {
    if (todo.status === "pending") {
      onUpdate(todo.id, "in_progress");
    } else if (todo.status === "in_progress") {
      onUpdate(todo.id, "completed");
    }
  };

  const handleDelete = () => {
    onDelete(todo.id);
    setIsDeleteOpen(false);
  };

  const getNextStatus = (): TodoStatus => {
    if (todo.status === "pending") return "in_progress";
    if (todo.status === "in_progress") return "completed";
    return "completed";
  };

  const getPrevStatus = (): TodoStatus => {
    if (todo.status === "completed") return "in_progress";
    if (todo.status === "in_progress") return "pending";
    return "pending";
  };

  return (
    <>
      <div
        className={`group relative bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 overflow-hidden ${
          isCompleted ? "opacity-75" : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg ${getCardBgColor(todo.status)}`}
        />

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
              disabled={isUpdating}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium text-sm leading-snug ${
                  isCompleted ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                  {todo.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-xs py-0.5 px-2 border ${priorityColors[todo.priority]}`}
              >
                {priorityLabels[todo.priority]}
              </Badge>
              {todo.due_date && (
                <Badge variant="outline" className="text-xs gap-1 py-0.5 px-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(todo.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 ">
              {canMoveLeft && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleMoveLeft}
                  disabled={isUpdating}
                  title={`Move to ${getPrevStatus() === "pending" ? "To Do" : "In Progress"}`}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
              )}
              {canMoveRight && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleMoveRight}
                  disabled={isUpdating}
                  title={`Move to ${getNextStatus() === "completed" ? "Done" : "In Progress"}`}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsEditOpen(true)}
                disabled={isUpdating || isDeleting}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isUpdating || isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TodoEditDialog
        todo={todo}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{todo.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

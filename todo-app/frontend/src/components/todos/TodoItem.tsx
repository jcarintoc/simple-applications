import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Trash2,
  Edit,
  Calendar,
  ChevronDown,
  Circle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { Todo, TodoPriority, TodoStatus } from "@/lib/api";
import { TodoEditDialog } from "./TodoEditDialog";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, status: TodoStatus) => void;
  onDelete: (id: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const priorityColors: Record<TodoPriority, string> = {
  low: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20",
  high: "bg-red-500/10 text-red-700 hover:bg-red-500/20",
};

const statusColors: Record<TodoStatus, string> = {
  pending: "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20",
  in_progress: "bg-purple-500/10 text-purple-700 hover:bg-purple-500/20",
  completed: "bg-green-500/10 text-green-700 hover:bg-green-500/20",
};

const statusLabels: Record<TodoStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusIcons: Record<TodoStatus, typeof Circle> = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
};

export function TodoItem({
  todo,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: TodoItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isCompleted = todo.status === "completed";

  const handleToggleComplete = () => {
    const newStatus: TodoStatus = isCompleted ? "pending" : "completed";
    onUpdate(todo.id, newStatus);
  };

  const handleDelete = () => {
    onDelete(todo.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Card className={isCompleted ? "opacity-60" : ""}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <h3
                className={`font-semibold leading-none ${
                  isCompleted ? "line-through" : ""
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-sm text-muted-foreground">
                  {todo.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditOpen(true)}
              disabled={isUpdating || isDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteOpen(true)}
              disabled={isUpdating || isDeleting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pb-4">
          <Badge className={priorityColors[todo.priority]}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                className={`${statusColors[todo.status]} cursor-pointer gap-1`}
                role="button"
              >
                {statusLabels[todo.status]}
                <ChevronDown className="h-3 w-3" />
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => onUpdate(todo.id, "pending")}
                disabled={isUpdating || todo.status === "pending"}
                className="gap-2"
              >
                <Circle className="h-4 w-4 text-gray-600" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdate(todo.id, "in_progress")}
                disabled={isUpdating || todo.status === "in_progress"}
                className="gap-2"
              >
                <Clock className="h-4 w-4 text-purple-600" />
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdate(todo.id, "completed")}
                disabled={isUpdating || todo.status === "completed"}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {todo.due_date && (
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(todo.due_date).toLocaleDateString()}
            </Badge>
          )}
        </CardContent>
      </Card>

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

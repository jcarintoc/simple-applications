import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Expense } from "@/lib/api/types";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="group flex items-center justify-between py-4 transition-colors hover:bg-accent/5">
      <div className="flex-1 space-y-1">
        <div className="flex items-baseline gap-3">
          <h3 className="font-medium text-foreground">{expense.title}</h3>
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {expense.category}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={expense.date}>{formatDate(expense.date)}</time>
          {expense.description && (
            <>
              <span className="text-border">•</span>
              <span className="line-clamp-1">{expense.description}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
          {formatAmount(expense.amount)}
        </span>

        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(expense)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit expense</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(expense.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete expense</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

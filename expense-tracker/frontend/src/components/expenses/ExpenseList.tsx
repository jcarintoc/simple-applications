import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpenseItem } from "./ExpenseItem";
import { ExpenseFilters } from "./ExpenseFilters";
import { ExpensePagination } from "./ExpensePagination";
import type { Expense } from "@/lib/api/types";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryValue: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAddNew: () => void;
  onExport: () => void;
  isExporting: boolean;
  hasExpenses: boolean;
}

export function ExpenseList({
  expenses,
  isLoading,
  searchValue,
  onSearchChange,
  categoryValue,
  onCategoryChange,
  categories,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew,
  onExport,
  isExporting,
  hasExpenses,
}: ExpenseListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>Manage and track all your expenses</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onExport}
                disabled={isExporting || !hasExpenses}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={onAddNew}>
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>

          <ExpenseFilters
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            categoryValue={categoryValue}
            onCategoryChange={onCategoryChange}
            categories={categories}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchValue || categoryValue !== "all"
                ? "No expenses match your filters"
                : "No expenses yet"}
            </p>
            {!searchValue && categoryValue === "all" && (
              <Button variant="link" onClick={onAddNew} className="mt-2">
                Add your first expense
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={() => onDelete(expense)}
                />
              ))}
            </div>

            <ExpensePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={expenses.length}
              onPageChange={onPageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

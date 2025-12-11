import { useState, useMemo, useEffect } from "react";
import {
  useUser,
  useLogout,
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useExportExpenses,
  useCsrfToken,
} from "@/lib/query";
import { DashboardHeader } from "@/components/expenses/DashboardHeader";
import { ExpenseStats } from "@/components/expenses/ExpenseStats";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFormDialog } from "@/components/expenses/ExpenseFormDialog";
import { DeleteExpenseDialog } from "@/components/expenses/DeleteExpenseDialog";
import type { CreateExpenseDto, Expense } from "@/lib/api/types";

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function DashboardPage() {
  const { data: userData, isLoading: userLoading } = useUser();
  const { data: expensesData, isLoading: expensesLoading } = useExpenses();
  useCsrfToken();
  const logoutMutation = useLogout();
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();
  const exportMutation = useExportExpenses();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCreateExpense = (data: CreateExpenseDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  };

  const handleUpdateExpense = (data: CreateExpenseDto) => {
    if (editingExpense) {
      updateMutation.mutate(
        { id: editingExpense.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingExpense(undefined);
          },
        }
      );
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setDeletingExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingExpense) {
      deleteMutation.mutate(deletingExpense.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingExpense(null);
        },
      });
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleAddNew = () => {
    setEditingExpense(undefined);
    setDialogOpen(true);
  };

  const expenses = expensesData?.expenses || [];

  const categories = useMemo(() => {
    const uniqueCategories = new Set(expenses.map((e) => e.category));
    return Array.from(uniqueCategories).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExpenses, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const filteredAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const user = userData?.user;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader
          userName={user?.name}
          onLogout={handleLogout}
          isLoggingOut={logoutMutation.isPending}
        />

        <ExpenseStats
          totalAmount={totalAmount}
          filteredAmount={filteredAmount}
          totalCount={expenses.length}
        />

        <ExpenseList
          expenses={paginatedExpenses}
          isLoading={expensesLoading}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          categoryValue={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAddNew={handleAddNew}
          onExport={handleExport}
          isExporting={exportMutation.isPending}
          hasExpenses={expenses.length > 0}
        />
      </div>

      <ExpenseFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingExpense(undefined);
          }
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        isLoading={createMutation.isPending || updateMutation.isPending}
        expense={editingExpense}
      />

      <DeleteExpenseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        expense={deletingExpense}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

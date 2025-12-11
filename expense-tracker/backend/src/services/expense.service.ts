import { expenseRepository } from "../repositories/index.js";
import type { Expense, CreateExpenseDto, UpdateExpenseDto } from "../types/index.js";

export class ExpenseService {
  getAllExpenses(userId: number): Expense[] {
    return expenseRepository.findByUserId(userId);
  }

  getExpenseById(id: number, userId: number): Expense | null {
    const expense = expenseRepository.findById(id, userId);
    return expense || null;
  }

  createExpense(userId: number, data: CreateExpenseDto): Expense {
    // Validate amount
    if (data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      throw new Error("Date must be in YYYY-MM-DD format");
    }

    return expenseRepository.create(userId, data);
  }

  updateExpense(id: number, userId: number, data: UpdateExpenseDto): Expense | null {
    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // Validate date format if provided
    if (data.date !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.date)) {
        throw new Error("Date must be in YYYY-MM-DD format");
      }
    }

    return expenseRepository.update(id, userId, data);
  }

  deleteExpense(id: number, userId: number): boolean {
    return expenseRepository.delete(id, userId);
  }

  exportToCSV(userId: number): string {
    const expenses = expenseRepository.findByUserId(userId);

    // CSV header
    const header = "ID,Title,Amount,Category,Date,Description,Created At";

    // CSV rows
    const rows = expenses.map((expense) => {
      const escapeCsvField = (field: string | number | null): string => {
        if (field === null || field === undefined) return "";
        const stringField = String(field);
        if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      };

      return [
        expense.id,
        escapeCsvField(expense.title),
        expense.amount,
        escapeCsvField(expense.category),
        expense.date,
        escapeCsvField(expense.description),
        expense.created_at,
      ].join(",");
    });

    return [header, ...rows].join("\n");
  }
}

export const expenseService = new ExpenseService();

import type { Response } from "express";
import { expenseService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import type { CsrfRequest } from "../middleware/csrf.middleware.js";

type ExpenseRequest = AuthRequest & CsrfRequest;

export class ExpenseController {
  async getAll(req: ExpenseRequest, res: Response): Promise<void> {
    try {
      const expenses = expenseService.getAllExpenses(req.userId!);

      // Generate and attach CSRF token
      const csrfToken = req.csrfToken?.();

      res.json({ expenses, csrfToken });
    } catch (error) {
      console.error("Get expenses error:", error);
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  }

  async getById(req: ExpenseRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid expense ID" });
      return;
    }

    try {
      const expense = expenseService.getExpenseById(id, req.userId!);

      if (!expense) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }

      res.json({ expense });
    } catch (error) {
      console.error("Get expense error:", error);
      res.status(500).json({ error: "Failed to fetch expense" });
    }
  }

  async create(req: ExpenseRequest, res: Response): Promise<void> {
    const { title, amount, category, date, description } = req.body;

    if (!title || amount === undefined || !category || !date) {
      res.status(400).json({ error: "Title, amount, category, and date are required" });
      return;
    }

    try {
      const expense = expenseService.createExpense(req.userId!, {
        title,
        amount: parseFloat(amount),
        category,
        date,
        description,
      });

      // Generate new CSRF token for next request
      const csrfToken = req.csrfToken?.();

      res.status(201).json({ expense, csrfToken });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create expense";
      res.status(400).json({ error: message });
    }
  }

  async update(req: ExpenseRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid expense ID" });
      return;
    }

    const { title, amount, category, date, description } = req.body;

    try {
      const expense = expenseService.updateExpense(id, req.userId!, {
        title,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        category,
        date,
        description,
      });

      if (!expense) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }

      // Generate new CSRF token for next request
      const csrfToken = req.csrfToken?.();

      res.json({ expense, csrfToken });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update expense";
      res.status(400).json({ error: message });
    }
  }

  async delete(req: ExpenseRequest, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid expense ID" });
      return;
    }

    try {
      const deleted = expenseService.deleteExpense(id, req.userId!);

      if (!deleted) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }

      // Generate new CSRF token for next request
      const csrfToken = req.csrfToken?.();

      res.json({ message: "Expense deleted successfully", csrfToken });
    } catch (error) {
      console.error("Delete expense error:", error);
      res.status(500).json({ error: "Failed to delete expense" });
    }
  }

  async exportCSV(req: ExpenseRequest, res: Response): Promise<void> {
    try {
      const csv = expenseService.exportToCSV(req.userId!);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="expenses-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Export CSV error:", error);
      res.status(500).json({ error: "Failed to export expenses" });
    }
  }

  async getCsrfToken(req: ExpenseRequest, res: Response): Promise<void> {
    try {
      const csrfToken = req.csrfToken?.();
      res.json({ csrfToken });
    } catch (error) {
      console.error("Get CSRF token error:", error);
      res.status(500).json({ error: "Failed to get CSRF token" });
    }
  }
}

export const expenseController = new ExpenseController();

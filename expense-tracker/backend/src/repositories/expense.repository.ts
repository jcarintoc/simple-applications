import { db } from "../db/database.js";
import type { Expense, CreateExpenseDto, UpdateExpenseDto } from "../types/index.js";

export class ExpenseRepository {
  findByUserId(userId: number): Expense[] {
    const stmt = db.prepare(`
      SELECT * FROM expenses
      WHERE user_id = ?
      ORDER BY date DESC, created_at DESC
    `);
    return stmt.all(userId) as Expense[];
  }

  findById(id: number, userId: number): Expense | undefined {
    const stmt = db.prepare(`
      SELECT * FROM expenses
      WHERE id = ? AND user_id = ?
    `);
    return stmt.get(id, userId) as Expense | undefined;
  }

  create(userId: number, data: CreateExpenseDto): Expense {
    const stmt = db.prepare(`
      INSERT INTO expenses (user_id, title, amount, category, date, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      data.title,
      data.amount,
      data.category,
      data.date,
      data.description || null
    );

    const newExpense = this.findById(result.lastInsertRowid as number, userId);
    if (!newExpense) {
      throw new Error("Failed to create expense");
    }

    return newExpense;
  }

  update(id: number, userId: number, data: UpdateExpenseDto): Expense | null {
    const expense = this.findById(id, userId);
    if (!expense) {
      return null;
    }

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      values.push(data.title);
    }
    if (data.amount !== undefined) {
      updates.push("amount = ?");
      values.push(data.amount);
    }
    if (data.category !== undefined) {
      updates.push("category = ?");
      values.push(data.category);
    }
    if (data.date !== undefined) {
      updates.push("date = ?");
      values.push(data.date);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description);
    }

    if (updates.length === 0) {
      return expense;
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id, userId);

    const stmt = db.prepare(`
      UPDATE expenses
      SET ${updates.join(", ")}
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(...values);

    return this.findById(id, userId) || null;
  }

  delete(id: number, userId: number): boolean {
    const stmt = db.prepare(`
      DELETE FROM expenses
      WHERE id = ? AND user_id = ?
    `);

    const result = stmt.run(id, userId);
    return result.changes > 0;
  }
}

export const expenseRepository = new ExpenseRepository();

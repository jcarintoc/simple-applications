import { db } from "../db/database.js";
import type { Todo, CreateTodoDto, UpdateTodoDto, TodoFilters, PaginationParams } from "../types/index.js";

export class TodoRepository {
  findById(id: number, userId: number): Todo | undefined {
    const stmt = db.prepare("SELECT * FROM todos WHERE id = ? AND user_id = ?");
    return stmt.get(id, userId) as Todo | undefined;
  }

  findAll(
    userId: number,
    filters: TodoFilters,
    pagination: PaginationParams
  ): { todos: Todo[]; total: number } {
    let query = "SELECT * FROM todos WHERE user_id = ?";
    const params: (string | number)[] = [userId];
    const conditions: string[] = [];

    // Apply filters
    if (filters.status) {
      conditions.push("status = ?");
      params.push(filters.status);
    }

    if (filters.priority) {
      conditions.push("priority = ?");
      params.push(filters.priority);
    }

    if (filters.search) {
      conditions.push("(title LIKE ? OR description LIKE ?)");
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    // Get total count
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as count");
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(...params) as { count: number };
    const total = countResult.count;

    // Add ordering and pagination
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const offset = (pagination.page - 1) * pagination.limit;
    params.push(pagination.limit, offset);

    const stmt = db.prepare(query);
    const todos = stmt.all(...params) as Todo[];

    return { todos, total };
  }

  create(userId: number, data: CreateTodoDto): Todo {
    const stmt = db.prepare(`
      INSERT INTO todos (user_id, title, description, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      data.title,
      data.description || null,
      data.status || "pending",
      data.priority || "medium",
      data.due_date || null
    );

    const todo = this.findById(result.lastInsertRowid as number, userId);
    if (!todo) {
      throw new Error("Failed to create todo");
    }

    return todo;
  }

  update(id: number, userId: number, data: UpdateTodoDto): Todo | null {
    // Check if todo exists and belongs to user
    const existing = this.findById(id, userId);
    if (!existing) {
      return null;
    }

    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      params.push(data.title);
    }

    if (data.description !== undefined) {
      updates.push("description = ?");
      params.push(data.description || null);
    }

    if (data.status !== undefined) {
      updates.push("status = ?");
      params.push(data.status);
    }

    if (data.priority !== undefined) {
      updates.push("priority = ?");
      params.push(data.priority);
    }

    if (data.due_date !== undefined) {
      updates.push("due_date = ?");
      params.push(data.due_date || null);
    }

    if (updates.length === 0) {
      return existing;
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id, userId);

    const query = `UPDATE todos SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...params);

    return this.findById(id, userId) || null;
  }

  delete(id: number, userId: number): boolean {
    const stmt = db.prepare("DELETE FROM todos WHERE id = ? AND user_id = ?");
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }

  deleteAll(userId: number): number {
    const stmt = db.prepare("DELETE FROM todos WHERE user_id = ?");
    const result = stmt.run(userId);
    return result.changes;
  }
}

export const todoRepository = new TodoRepository();

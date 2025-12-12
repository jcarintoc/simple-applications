import type { Response } from "express";
import { todoService } from "../services/index.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export class TodoController {
  async getTodos(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { status, priority, search, page, limit } = req.query;

      const result = await todoService.getTodos(
        userId,
        { status, priority, search },
        { page, limit }
      );

      res.json(result);
    } catch (error) {
      this.handleError(res, error, "Failed to fetch todos");
    }
  }

  async getTodoById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid todo ID" });
        return;
      }

      const todo = await todoService.getTodoById(id, userId);
      res.json(todo);
    } catch (error) {
      this.handleError(res, error, "Failed to fetch todo");
    }
  }

  async createTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const todo = await todoService.createTodo(userId, req.body);
      res.status(201).json(todo);
    } catch (error) {
      this.handleError(res, error, "Failed to create todo");
    }
  }

  async updateTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid todo ID" });
        return;
      }

      const todo = await todoService.updateTodo(id, userId, req.body);
      res.json(todo);
    } catch (error) {
      this.handleError(res, error, "Failed to update todo");
    }
  }

  async deleteTodo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid todo ID" });
        return;
      }

      await todoService.deleteTodo(id, userId);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error, "Failed to delete todo");
    }
  }

  async deleteAllTodos(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const count = await todoService.deleteAllTodos(userId);
      res.json({ message: `Deleted ${count} todo(s)` });
    } catch (error) {
      this.handleError(res, error, "Failed to delete todos");
    }
  }

  private handleError(res: Response, error: unknown, fallbackMessage: string): void {
    const message = error instanceof Error ? error.message : fallbackMessage;
    const knownErrors: Record<string, number> = {
      "Todo not found": 404,
    };

    // Check if it's a validation error
    if (message.startsWith("Validation error:")) {
      res.status(400).json({ error: message });
      return;
    }

    if (knownErrors[message]) {
      res.status(knownErrors[message]).json({ error: message });
      return;
    }

    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const todoController = new TodoController();

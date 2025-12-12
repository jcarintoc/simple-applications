import db from "../db/database.js";
import type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventFilterParams,
} from "../types/index.js";

export const eventRepository = {
  create(userId: number, data: CreateEventDto): Event {
    const stmt = db.prepare(`
      INSERT INTO events (user_id, title, date, time, description, tag)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      data.title,
      data.date,
      data.time,
      data.description || null,
      data.tag
    );

    return this.findById(result.lastInsertRowid as number, userId)!;
  },

  findById(id: number, userId: number): Event | undefined {
    const stmt = db.prepare(`
      SELECT * FROM events WHERE id = ? AND user_id = ?
    `);

    return stmt.get(id, userId) as Event | undefined;
  },

  findByUser(
    userId: number,
    params: EventFilterParams
  ): { events: Event[]; total: number } {
    const { search, filter = "all", page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE user_id = ?";
    const queryParams: (string | number)[] = [userId];

    // Add date filter
    const today = new Date().toISOString().split("T")[0];
    if (filter === "today") {
      whereClause += " AND date = ?";
      queryParams.push(today);
    } else if (filter === "week") {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const weekEnd = weekFromNow.toISOString().split("T")[0];
      whereClause += " AND date >= ? AND date <= ?";
      queryParams.push(today, weekEnd);
    }

    // Add search filter
    if (search) {
      whereClause += " AND title LIKE ?";
      queryParams.push(`%${search}%`);
    }

    // Only show upcoming events (today or future)
    whereClause += " AND date >= ?";
    queryParams.push(today);

    // Get total count
    const countStmt = db.prepare(`
      SELECT COUNT(*) as count FROM events ${whereClause}
    `);
    const { count: total } = countStmt.get(...queryParams) as { count: number };

    // Get paginated results
    const stmt = db.prepare(`
      SELECT * FROM events 
      ${whereClause}
      ORDER BY date ASC, time ASC
      LIMIT ? OFFSET ?
    `);

    const events = stmt.all(...queryParams, limit, offset) as Event[];

    return { events, total };
  },

  update(id: number, userId: number, data: UpdateEventDto): Event | undefined {
    const existing = this.findById(id, userId);
    if (!existing) return undefined;

    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      values.push(data.title);
    }
    if (data.date !== undefined) {
      updates.push("date = ?");
      values.push(data.date);
    }
    if (data.time !== undefined) {
      updates.push("time = ?");
      values.push(data.time);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      values.push(data.description || null);
    }
    if (data.tag !== undefined) {
      updates.push("tag = ?");
      values.push(data.tag);
    }

    if (updates.length === 0) {
      return existing;
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");

    const stmt = db.prepare(`
      UPDATE events SET ${updates.join(", ")} WHERE id = ? AND user_id = ?
    `);

    stmt.run(...values, id, userId);

    return this.findById(id, userId);
  },

  delete(id: number, userId: number): boolean {
    const stmt = db.prepare(`
      DELETE FROM events WHERE id = ? AND user_id = ?
    `);

    const result = stmt.run(id, userId);
    return result.changes > 0;
  },
};

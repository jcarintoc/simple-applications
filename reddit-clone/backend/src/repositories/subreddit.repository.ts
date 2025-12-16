import db from "../db/database.js";
import type {
  Subreddit,
  SubredditWithCreator,
  CreateSubredditDto,
  UpdateSubredditDto,
} from "../types/index.js";

export class SubredditRepository {
  findAll(): SubredditWithCreator[] {
    return db
      .prepare(
        `
      SELECT 
        s.*,
        u.name as creator_name
      FROM subreddits s
      JOIN users u ON s.creator_id = u.id
      ORDER BY s.created_at DESC
    `
      )
      .all() as SubredditWithCreator[];
  }

  findById(id: number): SubredditWithCreator | undefined {
    return db
      .prepare(
        `
      SELECT 
        s.*,
        u.name as creator_name
      FROM subreddits s
      JOIN users u ON s.creator_id = u.id
      WHERE s.id = ?
    `
      )
      .get(id) as SubredditWithCreator | undefined;
  }

  findByName(name: string): Subreddit | undefined {
    return db.prepare("SELECT * FROM subreddits WHERE name = ?").get(name) as Subreddit | undefined;
  }

  create(creatorId: number, data: CreateSubredditDto): number {
    const result = db
      .prepare("INSERT INTO subreddits (name, description, creator_id) VALUES (?, ?, ?)")
      .run(data.name, data.description, creatorId);
    return result.lastInsertRowid as number;
  }

  update(id: number, data: UpdateSubredditDto): boolean {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      params.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      params.push(data.description);
    }

    if (updates.length === 0) {
      return false;
    }

    params.push(id);
    const result = db
      .prepare(`UPDATE subreddits SET ${updates.join(", ")} WHERE id = ?`)
      .run(...params);
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM subreddits WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

export const subredditRepository = new SubredditRepository();


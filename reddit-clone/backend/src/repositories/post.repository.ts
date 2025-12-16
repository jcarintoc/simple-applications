import db from "../db/database.js";
import type {
  Post,
  PostWithAuthor,
  CreatePostDto,
  UpdatePostDto,
} from "../types/index.js";

export class PostRepository {
  findAll(): PostWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        p.*,
        u.name as author_name,
        s.name as subreddit_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN subreddits s ON p.subreddit_id = s.id
      ORDER BY p.created_at DESC
    `
      )
      .all() as PostWithAuthor[];
  }

  findBySubreddit(subredditId: number): PostWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        p.*,
        u.name as author_name,
        s.name as subreddit_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN subreddits s ON p.subreddit_id = s.id
      WHERE p.subreddit_id = ?
      ORDER BY p.created_at DESC
    `
      )
      .all(subredditId) as PostWithAuthor[];
  }

  findById(id: number): PostWithAuthor | undefined {
    return db
      .prepare(
        `
      SELECT 
        p.*,
        u.name as author_name,
        s.name as subreddit_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN subreddits s ON p.subreddit_id = s.id
      WHERE p.id = ?
    `
      )
      .get(id) as PostWithAuthor | undefined;
  }

  findByUser(userId: number): PostWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        p.*,
        u.name as author_name,
        s.name as subreddit_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN subreddits s ON p.subreddit_id = s.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `
      )
      .all(userId) as PostWithAuthor[];
  }

  create(userId: number, data: CreatePostDto): number {
    const result = db
      .prepare(
        "INSERT INTO posts (subreddit_id, user_id, title, content) VALUES (?, ?, ?, ?)"
      )
      .run(data.subreddit_id, userId, data.title, data.content);
    return result.lastInsertRowid as number;
  }

  update(id: number, data: UpdatePostDto): boolean {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      params.push(data.title);
    }
    if (data.content !== undefined) {
      updates.push("content = ?");
      params.push(data.content);
    }

    if (updates.length === 0) {
      return false;
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);
    const result = db
      .prepare(`UPDATE posts SET ${updates.join(", ")} WHERE id = ?`)
      .run(...params);
    return result.changes > 0;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM posts WHERE id = ?").run(id);
    return result.changes > 0;
  }

  incrementUpvotes(id: number): boolean {
    const result = db.prepare("UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }

  decrementUpvotes(id: number): boolean {
    const result = db.prepare("UPDATE posts SET upvotes = upvotes - 1 WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

export const postRepository = new PostRepository();


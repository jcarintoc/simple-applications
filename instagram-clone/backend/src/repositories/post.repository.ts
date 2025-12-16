import { db } from "../db/database.js";
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
        u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `
      )
      .all() as PostWithAuthor[];
  }

  findByUser(userId: number): PostWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `
      )
      .all(userId) as PostWithAuthor[];
  }

  findByFollowingUsers(followerId: number): PostWithAuthor[] {
    return db
      .prepare(
        `
      SELECT 
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN follows f ON p.user_id = f.following_id
      WHERE f.follower_id = ?
      ORDER BY p.created_at DESC
    `
      )
      .all(followerId) as PostWithAuthor[];
  }

  findById(id: number): PostWithAuthor | undefined {
    return db
      .prepare(
        `
      SELECT 
        p.*,
        u.name as author_name,
        u.email as author_email
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `
      )
      .get(id) as PostWithAuthor | undefined;
  }

  create(userId: number, data: CreatePostDto): Post {
    const result = db
      .prepare("INSERT INTO posts (user_id, image_url, caption) VALUES (?, ?, ?)")
      .run(userId, data.image_url, data.caption || null);
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(result.lastInsertRowid) as Post;
    return post;
  }

  update(id: number, data: UpdatePostDto): Post | undefined {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.caption !== undefined) {
      updates.push("caption = ?");
      values.push(data.caption || null);
    }

    if (updates.length === 0) {
      return this.findById(id) as Post | undefined;
    }

    updates.push("created_at = created_at"); // Keep original created_at
    values.push(id);

    db.prepare(`UPDATE posts SET ${updates.join(", ")} WHERE id = ?`).run(...values);
    return db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as Post | undefined;
  }

  delete(id: number): boolean {
    const result = db.prepare("DELETE FROM posts WHERE id = ?").run(id);
    return result.changes > 0;
  }

  incrementLikes(id: number): void {
    db.prepare("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?").run(id);
  }

  decrementLikes(id: number): void {
    db.prepare("UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?").run(id);
  }
}

export const postRepository = new PostRepository();

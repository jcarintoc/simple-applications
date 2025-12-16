import { db } from "../db/database.js";
import type { Follow, UserBasic } from "../types/index.js";

export class FollowRepository {
  exists(followerId: number, followingId: number): boolean {
    const follow = db
      .prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?")
      .get(followerId, followingId);
    return !!follow;
  }

  create(followerId: number, followingId: number): boolean {
    try {
      db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)").run(followerId, followingId);
      return true;
    } catch {
      // Already following or invalid (UNIQUE constraint or CHECK constraint violation)
      return false;
    }
  }

  delete(followerId: number, followingId: number): boolean {
    const result = db
      .prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?")
      .run(followerId, followingId);
    return result.changes > 0;
  }

  getFollowing(followerId: number): UserBasic[] {
    return db
      .prepare(
        `
        SELECT u.id, u.name, u.email
        FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ?
        ORDER BY f.created_at DESC
      `
      )
      .all(followerId) as UserBasic[];
  }

  getFollowers(followingId: number): UserBasic[] {
    return db
      .prepare(
        `
        SELECT u.id, u.name, u.email
        FROM follows f
        JOIN users u ON f.follower_id = u.id
        WHERE f.following_id = ?
        ORDER BY f.created_at DESC
      `
      )
      .all(followingId) as UserBasic[];
  }
}

export const followRepository = new FollowRepository();

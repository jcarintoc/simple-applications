import db from "../db/database.js";

export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: string;
}

export interface UserBasic {
  id: number;
  name: string;
  email: string;
  username: string;
}

export class FollowRepository {
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

  exists(followerId: number, followingId: number): boolean {
    const follow = db
      .prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?")
      .get(followerId, followingId);
    return !!follow;
  }

  getFollowers(userId: number, limit: number = 50, offset: number = 0): UserBasic[] {
    return db
      .prepare(`
        SELECT u.id, u.name, u.email, u.username
        FROM follows f
        JOIN users u ON f.follower_id = u.id
        WHERE f.following_id = ?
        ORDER BY f.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(userId, limit, offset) as UserBasic[];
  }

  getFollowing(userId: number, limit: number = 50, offset: number = 0): UserBasic[] {
    return db
      .prepare(`
        SELECT u.id, u.name, u.email, u.username
        FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ?
        ORDER BY f.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(userId, limit, offset) as UserBasic[];
  }

  countFollowers(userId: number): number {
    const result = db
      .prepare("SELECT COUNT(*) as count FROM follows WHERE following_id = ?")
      .get(userId) as { count: number };
    return result.count;
  }

  countFollowing(userId: number): number {
    const result = db
      .prepare("SELECT COUNT(*) as count FROM follows WHERE follower_id = ?")
      .get(userId) as { count: number };
    return result.count;
  }
}

export const followRepository = new FollowRepository();

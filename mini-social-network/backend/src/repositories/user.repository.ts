import db from "../db/database.js";
import type { User, CreateUserDto } from "../types/index.js";

export class UserRepository {
  findByEmail(email: string): User | undefined {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
  }

  findById(id: number): User | undefined {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
  }

  findByUsername(username: string): User | undefined {
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username) as User | undefined;
  }

  create(data: CreateUserDto & { password: string }): number {
    const result = db
      .prepare("INSERT INTO users (email, password, name, username) VALUES (?, ?, ?, ?)")
      .run(data.email, data.password, data.name, data.username);
    return result.lastInsertRowid as number;
  }

  emailExists(email: string): boolean {
    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    return !!user;
  }

  usernameExists(username: string): boolean {
    const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    return !!user;
  }

  getUserProfile(userId: number): (User & { followerCount: number; followingCount: number }) | undefined {
    const user = this.findById(userId);
    if (!user) return undefined;

    const followerCount = db.prepare("SELECT COUNT(*) as count FROM follows WHERE following_id = ?").get(userId) as { count: number };
    const followingCount = db.prepare("SELECT COUNT(*) as count FROM follows WHERE follower_id = ?").get(userId) as { count: number };

    return {
      ...user,
      followerCount: followerCount.count,
      followingCount: followingCount.count,
    };
  }
}

export const userRepository = new UserRepository();

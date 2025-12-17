import db from "../db/database.js";
import type { User, CreateUserDto } from "../types/index.js";

export class UserRepository {
  findByEmail(email: string): User | undefined {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
  }

  findById(id: number): User | undefined {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
  }

  create(data: CreateUserDto & { password: string }): number {
    const result = db
      .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
      .run(data.email, data.password, data.name);
    return result.lastInsertRowid as number;
  }

  emailExists(email: string): boolean {
    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    return !!user;
  }
}

export const userRepository = new UserRepository();

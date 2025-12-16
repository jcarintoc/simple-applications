import db from "../db/database.js";
import type { Profile, UpdateProfileDto, SuggestedUser } from "../types/index.js";

export class ProfileRepository {
  findByUserId(userId: number): Profile | undefined {
    return db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(userId) as Profile | undefined;
  }

  create(userId: number): number {
    const result = db.prepare("INSERT INTO profiles (user_id) VALUES (?)").run(userId);
    return result.lastInsertRowid as number;
  }

  update(userId: number, data: UpdateProfileDto): Profile | undefined {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (data.headline !== undefined) {
      fields.push("headline = ?");
      values.push(data.headline);
    }
    if (data.summary !== undefined) {
      fields.push("summary = ?");
      values.push(data.summary);
    }
    if (data.location !== undefined) {
      fields.push("location = ?");
      values.push(data.location);
    }
    if (data.industry !== undefined) {
      fields.push("industry = ?");
      values.push(data.industry);
    }
    if (data.profile_image_url !== undefined) {
      fields.push("profile_image_url = ?");
      values.push(data.profile_image_url);
    }
    if (data.banner_image_url !== undefined) {
      fields.push("banner_image_url = ?");
      values.push(data.banner_image_url);
    }

    if (fields.length === 0) {
      return this.findByUserId(userId);
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");

    const query = `UPDATE profiles SET ${fields.join(", ")} WHERE user_id = ?`;
    db.prepare(query).run(...values, userId);

    return this.findByUserId(userId);
  }

  getOrCreate(userId: number): Profile {
    let profile = this.findByUserId(userId);
    if (!profile) {
      this.create(userId);
      profile = this.findByUserId(userId)!;
    }
    return profile;
  }

  findSuggestedUsers(currentUserId: number, limit: number = 5): SuggestedUser[] {
    return db.prepare(`
      SELECT
        u.id,
        u.name,
        p.headline,
        p.profile_image_url
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id != ?
        AND u.id NOT IN (
          SELECT recipient_id FROM connections
          WHERE requester_id = ? AND status IN ('pending', 'accepted')
        )
        AND u.id NOT IN (
          SELECT requester_id FROM connections
          WHERE recipient_id = ? AND status IN ('pending', 'accepted')
        )
      ORDER BY RANDOM()
      LIMIT ?
    `).all(currentUserId, currentUserId, currentUserId, limit) as SuggestedUser[];
  }
}

export const profileRepository = new ProfileRepository();

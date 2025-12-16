import db from "../db/database.js";

export const likeRepository = {
  findByUserAndVideo(userId: number, videoId: number): boolean {
    const like = db.prepare(
      "SELECT id FROM video_likes WHERE user_id = ? AND video_id = ?"
    ).get(userId, videoId);
    return !!like;
  },

  create(userId: number, videoId: number): boolean {
    try {
      db.prepare(
        "INSERT INTO video_likes (user_id, video_id) VALUES (?, ?)"
      ).run(userId, videoId);
      return true;
    } catch {
      return false;
    }
  },

  delete(userId: number, videoId: number): boolean {
    const result = db.prepare(
      "DELETE FROM video_likes WHERE user_id = ? AND video_id = ?"
    ).run(userId, videoId);
    return result.changes > 0;
  },

  countByVideo(videoId: number): number {
    const result = db.prepare(
      "SELECT COUNT(*) as count FROM video_likes WHERE video_id = ?"
    ).get(videoId) as { count: number };
    return result.count;
  },
};

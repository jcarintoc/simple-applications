import db from "../db/database.js";

export interface Post {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface PostWithUser extends Post {
  user_name: string;
  user_email: string;
  user_username: string;
}

export interface PostWithStats extends PostWithUser {
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
}

export class PostRepository {
  create(userId: number, content: string): number {
    const result = db
      .prepare("INSERT INTO posts (user_id, content) VALUES (?, ?)")
      .run(userId, content);
    return result.lastInsertRowid as number;
  }

  findById(postId: number): PostWithUser | undefined {
    return db
      .prepare(`
        SELECT
          p.*,
          u.name as user_name,
          u.email as user_email,
          u.username as user_username
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `)
      .get(postId) as PostWithUser | undefined;
  }

  findAll(limit: number = 50, offset: number = 0): PostWithUser[] {
    return db
      .prepare(`
        SELECT
          p.*,
          u.name as user_name,
          u.email as user_email,
          u.username as user_username
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(limit, offset) as PostWithUser[];
  }

  findByUserId(userId: number, limit: number = 50, offset: number = 0): PostWithUser[] {
    return db
      .prepare(`
        SELECT
          p.*,
          u.name as user_name,
          u.email as user_email,
          u.username as user_username
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .all(userId, limit, offset) as PostWithUser[];
  }

  delete(postId: number, userId: number): boolean {
    const result = db
      .prepare("DELETE FROM posts WHERE id = ? AND user_id = ?")
      .run(postId, userId);
    return result.changes > 0;
  }

  getPostWithStats(postId: number, currentUserId?: number): PostWithStats | undefined {
    const post = this.findById(postId);
    if (!post) return undefined;

    const likeCount = db
      .prepare("SELECT COUNT(*) as count FROM likes WHERE post_id = ?")
      .get(postId) as { count: number };

    const commentCount = db
      .prepare("SELECT COUNT(*) as count FROM comments WHERE post_id = ?")
      .get(postId) as { count: number };

    let isLiked = false;
    if (currentUserId) {
      const like = db
        .prepare("SELECT id FROM likes WHERE post_id = ? AND user_id = ?")
        .get(postId, currentUserId);
      isLiked = !!like;
    }

    return {
      ...post,
      likeCount: likeCount.count,
      commentCount: commentCount.count,
      isLiked,
    };
  }

  getAllWithStats(limit: number = 50, offset: number = 0, currentUserId?: number): PostWithStats[] {
    const posts = this.findAll(limit, offset);
    return posts.map((post) => {
      const stats = this.getPostWithStats(post.id, currentUserId);
      return stats!;
    });
  }
}

export const postRepository = new PostRepository();

import { db } from "../db/database.js";
import { Post, PostWithAuthor, CreatePostDto, UpdatePostDto } from "../types/index.js";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createPost = (data: CreatePostDto, authorId: number): PostWithAuthor => {
  const slug = generateSlug(data.title);
  const timestamp = new Date().toISOString();

  const result = db
    .prepare(
      `INSERT INTO posts (title, content, slug, author_id, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(data.title, data.content, slug, authorId, data.published ? 1 : 0, timestamp);

  const postId = result.lastInsertRowid as number;

  // Fetch the post with author information
  const postWithAuthor = db
    .prepare<[number]>(
      `SELECT p.*, u.name as author_name, u.email as author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = ?`
    )
    .get(postId) as PostWithAuthor;

  return postWithAuthor;
};

export const findAllPosts = (publishedOnly = false): PostWithAuthor[] => {
  const query = publishedOnly
    ? `SELECT p.*, u.name as author_name, u.email as author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.published = 1
       ORDER BY p.created_at DESC`
    : `SELECT p.*, u.name as author_name, u.email as author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC`;

  return db.prepare(query).all() as PostWithAuthor[];
};

export const findPostById = (id: number): PostWithAuthor | undefined => {
  return db
    .prepare<[number]>(
      `SELECT p.*, u.name as author_name, u.email as author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.id = ?`
    )
    .get(id) as PostWithAuthor | undefined;
};

export const findPostBySlug = (slug: string): PostWithAuthor | undefined => {
  return db
    .prepare<[string]>(
      `SELECT p.*, u.name as author_name, u.email as author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.slug = ?`
    )
    .get(slug) as PostWithAuthor | undefined;
};

export const updatePost = (id: number, data: UpdatePostDto): Post | undefined => {
  const existing = db.prepare<[number]>("SELECT * FROM posts WHERE id = ?").get(id) as Post | undefined;

  if (!existing) {
    return undefined;
  }

  const updates: string[] = [];
  const values: (string | number | boolean)[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    values.push(data.title);
    updates.push("slug = ?");
    values.push(generateSlug(data.title));
  }

  if (data.content !== undefined) {
    updates.push("content = ?");
    values.push(data.content);
  }

  if (data.published !== undefined) {
    updates.push("published = ?");
    values.push(data.published ? 1 : 0);
  }

  updates.push("updated_at = ?");
  const timestamp = new Date().toISOString();
  values.push(timestamp);

  values.push(id);

  db.prepare(`UPDATE posts SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  return db.prepare<[number]>("SELECT * FROM posts WHERE id = ?").get(id) as Post;
};

export const deletePost = (id: number): boolean => {
  const result = db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  return result.changes > 0;
};

export const findPostsByAuthor = (authorId: number): PostWithAuthor[] => {
  return db
    .prepare<[number]>(
      `SELECT p.*, u.name as author_name, u.email as author_email
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.author_id = ?
       ORDER BY p.created_at DESC`
    )
    .all(authorId) as PostWithAuthor[];
};

import { db } from "../db/database.js";
import type { Bookmark, BookmarkWithTags, Tag, CreateBookmarkDto, UpdateBookmarkDto, BookmarkFilters, PaginatedResponse } from "../types/index.js";

export class BookmarkRepository {
  findById(id: number): Bookmark | undefined {
    const stmt = db.prepare("SELECT * FROM bookmarks WHERE id = ?");
    return stmt.get(id) as Bookmark | undefined;
  }

  findByIdWithTags(id: number): BookmarkWithTags | undefined {
    const bookmark = this.findById(id);
    if (!bookmark) return undefined;

    const tags = this.getTagsForBookmark(id);
    return { ...bookmark, tags };
  }

  findByUserId(userId: number, filters?: BookmarkFilters): PaginatedResponse<BookmarkWithTags> {
    let countQuery = "SELECT COUNT(*) as total FROM bookmarks WHERE user_id = ?";
    let query = "SELECT * FROM bookmarks WHERE user_id = ?";
    const params: (string | number | string[])[] = [userId];
    const countParams: (string | number | string[])[] = [userId];

    if (filters?.search) {
      const searchCondition = " AND (title LIKE ? OR description LIKE ? OR url LIKE ?)";
      query += searchCondition;
      countQuery += searchCondition;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (filters?.tags && filters.tags.length > 0) {
      const placeholders = filters.tags.map(() => "?").join(",");
      const tagCondition = ` AND id IN (
        SELECT DISTINCT bt.bookmark_id
        FROM bookmark_tags bt
        INNER JOIN tags t ON bt.tag_id = t.id
        WHERE t.name IN (${placeholders})
        GROUP BY bt.bookmark_id
        HAVING COUNT(DISTINCT t.id) = ?
      )`;
      query += tagCondition;
      countQuery += tagCondition;
      params.push(...filters.tags, filters.tags.length);
      countParams.push(...filters.tags, filters.tags.length);
    }

    // Get total count
    const countStmt = db.prepare(countQuery);
    const { total } = countStmt.get(...countParams) as { total: number };

    // Add pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const bookmarks = stmt.all(...params) as Bookmark[];

    const data = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: this.getTagsForBookmark(bookmark.id),
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  create(userId: number, data: CreateBookmarkDto): BookmarkWithTags {
    const stmt = db.prepare(
      "INSERT INTO bookmarks (user_id, url, title, description) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(userId, data.url, data.title, data.description || null);
    const bookmarkId = result.lastInsertRowid as number;

    if (data.tags && data.tags.length > 0) {
      this.addTagsToBookmark(bookmarkId, data.tags);
    }

    return this.findByIdWithTags(bookmarkId)!;
  }

  update(id: number, userId: number, data: UpdateBookmarkDto): BookmarkWithTags | null {
    const bookmark = this.findById(id);
    if (!bookmark || bookmark.user_id !== userId) {
      return null;
    }

    const updates: string[] = [];
    const params: (string | null)[] = [];

    if (data.url !== undefined) {
      updates.push("url = ?");
      params.push(data.url);
    }
    if (data.title !== undefined) {
      updates.push("title = ?");
      params.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push("description = ?");
      params.push(data.description || null);
    }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      const query = `UPDATE bookmarks SET ${updates.join(", ")} WHERE id = ?`;
      params.push(id.toString());
      const stmt = db.prepare(query);
      stmt.run(...params);
    }

    if (data.tags !== undefined) {
      this.removeAllTagsFromBookmark(id);
      if (data.tags.length > 0) {
        this.addTagsToBookmark(id, data.tags);
      }
    }

    return this.findByIdWithTags(id)!;
  }

  delete(id: number, userId: number): boolean {
    const bookmark = this.findById(id);
    if (!bookmark || bookmark.user_id !== userId) {
      return false;
    }

    const stmt = db.prepare("DELETE FROM bookmarks WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  private getTagsForBookmark(bookmarkId: number): Tag[] {
    const stmt = db.prepare(`
      SELECT t.* FROM tags t
      INNER JOIN bookmark_tags bt ON t.id = bt.tag_id
      WHERE bt.bookmark_id = ?
      ORDER BY t.name
    `);
    return stmt.all(bookmarkId) as Tag[];
  }

  private findOrCreateTag(name: string): number {
    const selectStmt = db.prepare("SELECT id FROM tags WHERE name = ?");
    const existing = selectStmt.get(name) as { id: number } | undefined;

    if (existing) {
      return existing.id;
    }

    const insertStmt = db.prepare("INSERT INTO tags (name) VALUES (?)");
    const result = insertStmt.run(name);
    return result.lastInsertRowid as number;
  }

  private addTagsToBookmark(bookmarkId: number, tagNames: string[]): void {
    const stmt = db.prepare("INSERT INTO bookmark_tags (bookmark_id, tag_id) VALUES (?, ?)");

    for (const tagName of tagNames) {
      const tagId = this.findOrCreateTag(tagName.toLowerCase().trim());
      stmt.run(bookmarkId, tagId);
    }
  }

  private removeAllTagsFromBookmark(bookmarkId: number): void {
    const stmt = db.prepare("DELETE FROM bookmark_tags WHERE bookmark_id = ?");
    stmt.run(bookmarkId);
  }

  getAllTags(): Tag[] {
    const stmt = db.prepare(`
      SELECT DISTINCT t.*
      FROM tags t
      INNER JOIN bookmark_tags bt ON t.id = bt.tag_id
      ORDER BY t.name
    `);
    return stmt.all() as Tag[];
  }

  getTagsByUserId(userId: number): Tag[] {
    const stmt = db.prepare(`
      SELECT DISTINCT t.*
      FROM tags t
      INNER JOIN bookmark_tags bt ON t.id = bt.tag_id
      INNER JOIN bookmarks b ON bt.bookmark_id = b.id
      WHERE b.user_id = ?
      ORDER BY t.name
    `);
    return stmt.all(userId) as Tag[];
  }
}

export const bookmarkRepository = new BookmarkRepository();

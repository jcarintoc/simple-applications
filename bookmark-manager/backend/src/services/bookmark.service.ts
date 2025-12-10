import { bookmarkRepository } from "../repositories/index.js";
import type { BookmarkWithTags, CreateBookmarkDto, UpdateBookmarkDto, BookmarkFilters, Tag } from "../types/index.js";

export class BookmarkService {
  getBookmarks(userId: number, filters?: BookmarkFilters): BookmarkWithTags[] {
    return bookmarkRepository.findByUserId(userId, filters);
  }

  getBookmarkById(id: number, userId: number): BookmarkWithTags | null {
    const bookmark = bookmarkRepository.findByIdWithTags(id);
    if (!bookmark || bookmark.user_id !== userId) {
      return null;
    }
    return bookmark;
  }

  createBookmark(userId: number, data: CreateBookmarkDto): BookmarkWithTags {
    this.validateUrl(data.url);
    this.validateTitle(data.title);
    return bookmarkRepository.create(userId, data);
  }

  updateBookmark(id: number, userId: number, data: UpdateBookmarkDto): BookmarkWithTags | null {
    if (data.url !== undefined) {
      this.validateUrl(data.url);
    }
    if (data.title !== undefined) {
      this.validateTitle(data.title);
    }
    return bookmarkRepository.update(id, userId, data);
  }

  deleteBookmark(id: number, userId: number): boolean {
    return bookmarkRepository.delete(id, userId);
  }

  getAllTags(): Tag[] {
    return bookmarkRepository.getAllTags();
  }

  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error("Invalid URL format");
    }
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (title.length > 255) {
      throw new Error("Title must be less than 255 characters");
    }
  }
}

export const bookmarkService = new BookmarkService();

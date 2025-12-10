import { apiClient } from "./client.js";
import type { BookmarkWithTags, CreateBookmarkDto, UpdateBookmarkDto, Tag } from "./types.js";

let csrfToken: string | null = null;

export const bookmarkApi = {
  async getCsrfToken(): Promise<string> {
    if (csrfToken) return csrfToken;
    const response = await apiClient.get<{ csrfToken: string }>("/bookmarks/csrf-token");
    csrfToken = response.data.csrfToken;
    return csrfToken;
  },

  async getBookmarks(filters?: { search?: string; tags?: string[] }): Promise<BookmarkWithTags[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.tags && filters.tags.length > 0) params.append("tags", filters.tags.join(","));

    const response = await apiClient.get<{ bookmarks: BookmarkWithTags[] }>(
      `/bookmarks${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data.bookmarks;
  },

  async getBookmarkById(id: number): Promise<BookmarkWithTags> {
    const response = await apiClient.get<{ bookmark: BookmarkWithTags }>(`/bookmarks/${id}`);
    return response.data.bookmark;
  },

  async createBookmark(data: CreateBookmarkDto): Promise<BookmarkWithTags> {
    const token = await this.getCsrfToken();
    const response = await apiClient.post<{ bookmark: BookmarkWithTags }>(
      "/bookmarks",
      data,
      { headers: { "x-csrf-token": token } }
    );
    return response.data.bookmark;
  },

  async updateBookmark(id: number, data: UpdateBookmarkDto): Promise<BookmarkWithTags> {
    const token = await this.getCsrfToken();
    const response = await apiClient.put<{ bookmark: BookmarkWithTags }>(
      `/bookmarks/${id}`,
      data,
      { headers: { "x-csrf-token": token } }
    );
    return response.data.bookmark;
  },

  async deleteBookmark(id: number): Promise<void> {
    const token = await this.getCsrfToken();
    await apiClient.delete(`/bookmarks/${id}`, {
      headers: { "x-csrf-token": token },
    });
  },

  async getTags(): Promise<Tag[]> {
    const response = await apiClient.get<{ tags: Tag[] }>("/bookmarks/tags");
    return response.data.tags;
  },

  clearCsrfToken(): void {
    csrfToken = null;
  },
};

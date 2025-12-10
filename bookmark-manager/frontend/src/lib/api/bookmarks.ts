import { apiClient } from "./client.js";
import type { BookmarkWithTags, CreateBookmarkDto, UpdateBookmarkDto, Tag, BookmarkFilters, PaginatedResponse } from "./types.js";

let csrfToken: string | null = null;

export const bookmarkApi = {
  async getCsrfToken(): Promise<string> {
    if (csrfToken) return csrfToken;
    const response = await apiClient.get<{ csrfToken: string }>("/bookmarks/csrf-token");
    csrfToken = response.data.csrfToken;
    return csrfToken;
  },

  async getBookmarks(filters?: BookmarkFilters): Promise<PaginatedResponse<BookmarkWithTags>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.tags && filters.tags.length > 0) params.append("tags", filters.tags.join(","));
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await apiClient.get<PaginatedResponse<BookmarkWithTags>>(
      `/bookmarks${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  async getBookmarkById(id: number): Promise<BookmarkWithTags> {
    const response = await apiClient.get<{ bookmark: BookmarkWithTags }>(`/bookmarks/${id}`);
    return response.data.bookmark;
  },

  async createBookmark(data: CreateBookmarkDto): Promise<BookmarkWithTags> {
    try {
      const token = await this.getCsrfToken();
      const response = await apiClient.post<{ bookmark: BookmarkWithTags }>(
        "/bookmarks",
        data,
        { headers: { "x-csrf-token": token } }
      );
      return response.data.bookmark;
    } catch (error: unknown) {
      // If CSRF token is invalid, clear it and retry once
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 403 && axiosError.response?.data?.error === "Invalid CSRF token") {
          this.clearCsrfToken();
          const newToken = await this.getCsrfToken();
          const response = await apiClient.post<{ bookmark: BookmarkWithTags }>(
            "/bookmarks",
            data,
            { headers: { "x-csrf-token": newToken } }
          );
          return response.data.bookmark;
        }
      }
      throw error;
    }
  },

  async updateBookmark(id: number, data: UpdateBookmarkDto): Promise<BookmarkWithTags> {
    try {
      const token = await this.getCsrfToken();
      const response = await apiClient.put<{ bookmark: BookmarkWithTags }>(
        `/bookmarks/${id}`,
        data,
        { headers: { "x-csrf-token": token } }
      );
      return response.data.bookmark;
    } catch (error: unknown) {
      // If CSRF token is invalid, clear it and retry once
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 403 && axiosError.response?.data?.error === "Invalid CSRF token") {
          this.clearCsrfToken();
          const newToken = await this.getCsrfToken();
          const response = await apiClient.put<{ bookmark: BookmarkWithTags }>(
            `/bookmarks/${id}`,
            data,
            { headers: { "x-csrf-token": newToken } }
          );
          return response.data.bookmark;
        }
      }
      throw error;
    }
  },

  async deleteBookmark(id: number): Promise<void> {
    try {
      const token = await this.getCsrfToken();
      await apiClient.delete(`/bookmarks/${id}`, {
        headers: { "x-csrf-token": token },
      });
    } catch (error: unknown) {
      // If CSRF token is invalid, clear it and retry once
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 403 && axiosError.response?.data?.error === "Invalid CSRF token") {
          this.clearCsrfToken();
          const newToken = await this.getCsrfToken();
          await apiClient.delete(`/bookmarks/${id}`, {
            headers: { "x-csrf-token": newToken },
          });
          return;
        }
      }
      throw error;
    }
  },

  async getTags(): Promise<Tag[]> {
    const response = await apiClient.get<{ tags: Tag[] }>("/bookmarks/tags");
    return response.data.tags;
  },

  clearCsrfToken(): void {
    csrfToken = null;
  },
};

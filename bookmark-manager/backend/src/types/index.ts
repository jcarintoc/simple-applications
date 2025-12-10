export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: number;
}

export interface Bookmark {
  id: number;
  user_id: number;
  url: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

export interface BookmarkTag {
  bookmark_id: number;
  tag_id: number;
}

export interface BookmarkWithTags extends Bookmark {
  tags: Tag[];
}

export interface CreateBookmarkDto {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface UpdateBookmarkDto {
  url?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface BookmarkFilters {
  search?: string;
  tags?: string[];
}

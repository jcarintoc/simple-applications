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

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  author_id: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostWithAuthor extends Post {
  author_name: string;
  author_email: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  created_at: string;
}

export interface CommentWithAuthor extends Comment {
  author_name: string;
  author_email: string;
}

export interface CreateCommentDto {
  content: string;
}

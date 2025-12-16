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

// Subreddit types
export interface Subreddit {
  id: number;
  name: string;
  description: string;
  creator_id: number;
  created_at: string;
}

export interface SubredditWithCreator extends Subreddit {
  creator_name: string;
}

export interface CreateSubredditDto {
  name: string;
  description: string;
}

export interface UpdateSubredditDto {
  name?: string;
  description?: string;
}

// Post types
export interface Post {
  id: number;
  subreddit_id: number;
  user_id: number;
  title: string;
  content: string;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface PostWithAuthor extends Post {
  author_name: string;
  subreddit_name: string;
}

export interface CreatePostDto {
  subreddit_id: number;
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

// Comment types
export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface CommentWithAuthor extends Comment {
  author_name: string;
}

export interface CreateCommentDto {
  content: string;
  parent_id?: number | null;
}

export interface UpdateCommentDto {
  content?: string;
}

// Vote types
export interface Vote {
  id: number;
  user_id: number;
  post_id: number | null;
  comment_id: number | null;
  created_at: string;
}

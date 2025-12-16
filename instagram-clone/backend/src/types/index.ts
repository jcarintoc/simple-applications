// Post types
export interface Post {
  id: number;
  user_id: number;
  image_url: string;
  caption: string | null;
  likes_count: number;
  created_at: string;
}

export interface PostWithAuthor extends Post {
  author_name: string;
  author_email: string;
}

export interface CreatePostDto {
  image_url: string;
  caption?: string | null;
}

export interface UpdatePostDto {
  caption?: string | null;
}

// Comment types
export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface CommentWithAuthor extends Comment {
  author_name: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content?: string;
}

// Like types
export interface Like {
  id: number;
  user_id: number;
  post_id: number;
  created_at: string;
}

// Follow types
export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: string;
}

export interface UserBasic {
  id: number;
  name: string;
  email: string;
}

// Story types
export interface Story {
  id: number;
  user_id: number;
  image_url: string;
  expires_at: string;
  created_at: string;
}

export interface StoryWithAuthor extends Story {
  author_name: string;
}

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

// Title types
export type TitleType = "movie" | "show";

export interface Title {
  id: number;
  title: string;
  type: TitleType;
  description: string | null;
  genre: string;
  release_year: number;
  duration_minutes: number | null;
  seasons: number | null;
  thumbnail_url: string | null;
  created_at: string;
}

export interface TitleWithUserData extends Title {
  in_watchlist: boolean;
  user_rating: number | null;
  avg_rating: number | null;
}

// Watchlist types
export interface WatchlistItem {
  id: number;
  user_id: number;
  title_id: number;
  added_at: string;
}

// Rating types
export interface Rating {
  id: number;
  user_id: number;
  title_id: number;
  rating: number;
  rated_at: string;
}

export interface RateDto {
  rating: number;
}

// Continue watching types
export interface ContinueWatching {
  id: number;
  session_id: string;
  title_id: number;
  progress_percent: number;
  last_watched: string;
}

export interface ContinueWatchingWithTitle extends ContinueWatching {
  title: Title;
}

export interface UpdateProgressDto {
  progress_percent: number;
}

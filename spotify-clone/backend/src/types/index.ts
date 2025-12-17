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

// Song types
export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  duration_seconds: number;
  cover_url: string | null;
  created_at: string;
}

export interface SongWithLiked extends Song {
  is_liked: boolean;
}

// Playlist types
export interface Playlist {
  id: number;
  name: string;
  description: string | null;
  user_id: number;
  created_at: string;
}

export interface PlaylistWithSongs extends Playlist {
  songs: SongWithLiked[];
  song_count: number;
}

export interface CreatePlaylistDto {
  name: string;
  description?: string;
}

export interface UpdatePlaylistDto {
  name?: string;
  description?: string;
}

// Playlist songs types
export interface PlaylistSong {
  id: number;
  playlist_id: number;
  song_id: number;
  position: number;
  added_at: string;
}

// Liked songs types
export interface LikedSong {
  id: number;
  user_id: number;
  song_id: number;
  liked_at: string;
}

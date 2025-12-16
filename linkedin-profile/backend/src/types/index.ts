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

// Profile types
export interface Profile {
  id: number;
  user_id: number;
  headline: string | null;
  summary: string | null;
  location: string | null;
  industry: string | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  id: number;
  user_id: number;
  headline: string | null;
  summary: string | null;
  location: string | null;
  industry: string | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  user: UserResponse;
}

export interface UpdateProfileDto {
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  profile_image_url?: string;
  banner_image_url?: string;
}

// Connection types
export interface Connection {
  id: number;
  requester_id: number;
  recipient_id: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface ConnectionRequest {
  recipient_id: number;
}

export interface ConnectionResponse {
  id: number;
  user_id: number;
  name: string;
  headline: string | null;
  profile_image_url: string | null;
  connected_at: string;
}

export interface ConnectionRequestResponse {
  id: number;
  requester_id: number;
  requester_name: string;
  requester_headline: string | null;
  requester_profile_image_url: string | null;
  created_at: string;
}

export interface ConnectionStatusResponse {
  status: "none" | "pending_sent" | "pending_received" | "connected" | "self";
  connection_id?: number;
}

// Job types
export interface JobPost {
  id: number;
  company_name: string;
  job_title: string;
  description: string;
  location: string | null;
  employment_type: "full-time" | "part-time" | "contract" | "internship" | null;
  experience_level: "entry" | "mid" | "senior" | "executive" | null;
  posted_by_user_id: number | null;
  created_at: string;
}

export interface JobPostWithApplicationStatus extends JobPost {
  has_applied: boolean;
}

export interface JobApplication {
  id: number;
  job_post_id: number;
  user_id: number;
  status: "submitted" | "reviewing" | "rejected" | "accepted";
  cover_letter: string | null;
  created_at: string;
}

export interface JobApplicationDto {
  cover_letter?: string;
}

export interface JobApplicationWithDetails {
  id: number;
  job_post_id: number;
  job_title: string;
  company_name: string;
  status: string;
  created_at: string;
}

// Suggested user types
export interface SuggestedUser {
  id: number;
  name: string;
  headline: string | null;
  profile_image_url: string | null;
}

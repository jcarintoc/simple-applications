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

export interface Email {
  id: number;
  from_user_id: number;
  to_user_id: number;
  subject: string;
  body: string;
  is_read: number;
  is_archived: number;
  archived_by_sender: number;
  archived_by_recipient: number;
  is_deleted: number;
  created_at: string;
}

export interface EmailWithUsers extends Email {
  from_user_name: string;
  from_user_email: string;
  to_user_name: string;
  to_user_email: string;
}

export interface SendEmailDto {
  to_email: string;
  subject: string;
  body: string;
}

export type EmailFolder = "inbox" | "sent" | "archive" | "trash";

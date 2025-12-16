import { apiClient } from "./client";
import {
  type Email,
  type SendEmailInput,
  type EmailFolder,
  emailsResponseSchema,
  emailResponseSchema,
  sendEmailInputSchema,
  unreadCountResponseSchema,
} from "./types";

export const emailsApi = {
  getEmails: async (folder: EmailFolder = "inbox"): Promise<Email[]> => {
    const response = await apiClient.get(`/emails?folder=${folder}`);
    return emailsResponseSchema.parse(response.data).emails;
  },

  getEmailById: async (id: number): Promise<Email> => {
    const response = await apiClient.get(`/emails/${id}`);
    return emailResponseSchema.parse(response.data).email;
  },

  sendEmail: async (data: SendEmailInput): Promise<Email> => {
    const validatedData = sendEmailInputSchema.parse(data);
    const response = await apiClient.post("/emails", validatedData);
    return emailResponseSchema.parse(response.data).email;
  },

  markAsRead: async (id: number): Promise<void> => {
    await apiClient.patch(`/emails/${id}/read`);
  },

  markAsUnread: async (id: number): Promise<void> => {
    await apiClient.patch(`/emails/${id}/unread`);
  },

  archive: async (id: number): Promise<void> => {
    await apiClient.patch(`/emails/${id}/archive`);
  },

  unarchive: async (id: number): Promise<void> => {
    await apiClient.patch(`/emails/${id}/unarchive`);
  },

  deleteEmail: async (id: number): Promise<void> => {
    await apiClient.delete(`/emails/${id}`);
  },

  restore: async (id: number): Promise<void> => {
    await apiClient.patch(`/emails/${id}/restore`);
  },

  permanentDelete: async (id: number): Promise<void> => {
    await apiClient.delete(`/emails/${id}/permanent`);
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get("/emails/unread-count");
    return unreadCountResponseSchema.parse(response.data).count;
  },
};
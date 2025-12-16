import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailsApi, type EmailFolder, type SendEmailInput } from "../api";

export const emailKeys = {
  all: ["emails"] as const,
  lists: () => [...emailKeys.all, "list"] as const,
  list: (folder: EmailFolder) => [...emailKeys.lists(), folder] as const,
  details: () => [...emailKeys.all, "detail"] as const,
  detail: (id: number) => [...emailKeys.details(), id] as const,
  unreadCount: () => [...emailKeys.all, "unread-count"] as const,
};

export function useEmails(folder: EmailFolder = "inbox") {
  return useQuery({
    queryKey: emailKeys.list(folder),
    queryFn: () => emailsApi.getEmails(folder),
  });
}

export function useEmail(id: number) {
  return useQuery({
    queryKey: emailKeys.detail(id),
    queryFn: () => emailsApi.getEmailById(id),
    enabled: !!id,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: emailKeys.unreadCount(),
    queryFn: () => emailsApi.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendEmailInput) => emailsApi.sendEmail(data),
    onSuccess: () => {
      // Invalidate sent folder and inbox (in case sent to self)
      queryClient.invalidateQueries({ queryKey: emailKeys.list("sent") });
      queryClient.invalidateQueries({ queryKey: emailKeys.list("inbox") });
      queryClient.invalidateQueries({ queryKey: emailKeys.unreadCount() });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emailsApi.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: emailKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emailKeys.unreadCount() });
    },
  });
}

export function useMarkAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emailsApi.markAsUnread(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: emailKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emailKeys.unreadCount() });
    },
  });
}

export function useArchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emailsApi.archive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: emailKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emailKeys.unreadCount() });
    },
  });
}

export function useUnarchive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emailsApi.unarchive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: emailKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
  });
}

export function useDeleteEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emailsApi.deleteEmail(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: emailKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emailKeys.unreadCount() });
    },
  });
}

export function useRestore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emailsApi.restore(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: emailKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
  });
}

export function usePermanentDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => emailsApi.permanentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.lists() });
    },
  });
}
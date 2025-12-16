import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConnections,
  getPendingRequests,
  getSentRequests,
  getConnectionStatus,
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  removeConnection,
} from "../api/connections";
import { profileKeys } from "./profiles";

export const connectionKeys = {
  all: ["connections"] as const,
  list: () => [...connectionKeys.all, "list"] as const,
  pending: () => [...connectionKeys.all, "pending"] as const,
  sent: () => [...connectionKeys.all, "sent"] as const,
  status: (userId: number) => [...connectionKeys.all, "status", userId] as const,
};

export function useConnections() {
  return useQuery({
    queryKey: connectionKeys.list(),
    queryFn: getConnections,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePendingRequests() {
  return useQuery({
    queryKey: connectionKeys.pending(),
    queryFn: getPendingRequests,
    staleTime: 1 * 60 * 1000,
  });
}

export function useSentRequests() {
  return useQuery({
    queryKey: connectionKeys.sent(),
    queryFn: getSentRequests,
    staleTime: 1 * 60 * 1000,
  });
}

export function useConnectionStatus(userId: number) {
  return useQuery({
    queryKey: connectionKeys.status(userId),
    queryFn: () => getConnectionStatus(userId),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipientId: number) => sendConnectionRequest(recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
      queryClient.invalidateQueries({ queryKey: profileKeys.suggested() });
    },
  });
}

export function useAcceptConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: number) => acceptConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

export function useRejectConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: number) => rejectConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

export function useRemoveConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: number) => removeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

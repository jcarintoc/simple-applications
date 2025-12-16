import { apiClient } from "./client";
import type { ConnectionResponse, ConnectionRequest, ConnectionStatus } from "./types";

export async function getConnections(): Promise<ConnectionResponse[]> {
  const { data } = await apiClient.get<{ connections: ConnectionResponse[] }>("/connections");
  return data.connections;
}

export async function getPendingRequests(): Promise<ConnectionRequest[]> {
  const { data } = await apiClient.get<{ requests: ConnectionRequest[] }>("/connections/pending");
  return data.requests;
}

export async function getSentRequests(): Promise<ConnectionRequest[]> {
  const { data } = await apiClient.get<{ requests: ConnectionRequest[] }>("/connections/sent");
  return data.requests;
}

export async function getConnectionStatus(userId: number): Promise<ConnectionStatus> {
  const { data } = await apiClient.get<ConnectionStatus>(`/connections/status/${userId}`);
  return data;
}

export async function sendConnectionRequest(recipientId: number): Promise<void> {
  await apiClient.post("/connections/request", { recipient_id: recipientId });
}

export async function acceptConnection(connectionId: number): Promise<void> {
  await apiClient.put(`/connections/${connectionId}/accept`);
}

export async function rejectConnection(connectionId: number): Promise<void> {
  await apiClient.put(`/connections/${connectionId}/reject`);
}

export async function removeConnection(connectionId: number): Promise<void> {
  await apiClient.delete(`/connections/${connectionId}`);
}

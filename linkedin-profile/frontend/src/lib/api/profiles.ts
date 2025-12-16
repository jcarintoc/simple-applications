import { apiClient } from "./client";
import type { Profile, UpdateProfileInput, SuggestedUser } from "./types";

export async function getMyProfile(): Promise<Profile> {
  const { data } = await apiClient.get<{ profile: Profile }>("/profiles/me");
  return data.profile;
}

export async function getProfile(userId: number): Promise<Profile> {
  const { data } = await apiClient.get<{ profile: Profile }>(`/profiles/${userId}`);
  return data.profile;
}

export async function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  const { data } = await apiClient.put<{ profile: Profile }>("/profiles/me", input);
  return data.profile;
}

export async function getSuggestedUsers(limit?: number): Promise<SuggestedUser[]> {
  const params = limit ? { limit } : {};
  const { data } = await apiClient.get<{ users: SuggestedUser[] }>("/profiles/suggested", { params });
  return data.users;
}

import { profileRepository } from "../repositories/profile.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import type { UpdateProfileDto, ProfileResponse, SuggestedUser } from "../types/index.js";

export class ProfileService {
  getProfile(userId: number): ProfileResponse {
    const profile = profileRepository.getOrCreate(userId);
    const user = userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...profile,
      user: { id: user.id, email: user.email, name: user.name }
    };
  }

  updateProfile(userId: number, data: UpdateProfileDto): ProfileResponse {
    const profile = profileRepository.update(userId, data);

    if (!profile) {
      throw new Error("Failed to update profile");
    }

    const user = userRepository.findById(userId)!;

    return {
      ...profile,
      user: { id: user.id, email: user.email, name: user.name }
    };
  }

  getSuggestedUsers(currentUserId: number, limit?: number): SuggestedUser[] {
    return profileRepository.findSuggestedUsers(currentUserId, limit);
  }
}

export const profileService = new ProfileService();

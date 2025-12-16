import { followRepository, userRepository } from "../repositories/index.js";
import type { UserBasic } from "../types/index.js";

export class FollowService {
  follow(followerId: number, followingId: number): { success: boolean; message: string } {
    // Prevent self-follow
    if (followerId === followingId) {
      throw new Error("You cannot follow yourself");
    }

    // Check if user exists
    const user = userRepository.findById(followingId);
    if (!user) {
      throw new Error("User not found");
    }

    const created = followRepository.create(followerId, followingId);

    if (!created) {
      // Already following
      return { success: true, message: "Already following this user" };
    }

    return { success: true, message: "User followed successfully" };
  }

  unfollow(followerId: number, followingId: number): { success: boolean; message: string } {
    const deleted = followRepository.delete(followerId, followingId);

    if (!deleted) {
      // Not following
      return { success: true, message: "You are not following this user" };
    }

    return { success: true, message: "User unfollowed successfully" };
  }

  isFollowing(followerId: number, followingId: number): boolean {
    return followRepository.exists(followerId, followingId);
  }

  getFollowing(followerId: number): UserBasic[] {
    return followRepository.getFollowing(followerId);
  }

  getFollowers(followingId: number): UserBasic[] {
    return followRepository.getFollowers(followingId);
  }
}

export const followService = new FollowService();

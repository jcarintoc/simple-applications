import { favoriteRepository } from "../repositories/index.js";
import type { Favorite, CreateFavoriteDto, UpdateFavoriteDto, FavoriteResponse } from "../types/index.js";

export class FavoriteService {
  findAllByUserId(userId: number): FavoriteResponse[] {
    const favorites = favoriteRepository.findAllByUserId(userId);
    return favorites.map(this.toFavoriteResponse);
  }

  create(userId: number, data: CreateFavoriteDto): FavoriteResponse {
    const id = favoriteRepository.create(userId, data);
    const favorite = favoriteRepository.findById(id);
    if (!favorite) {
      throw new Error("Failed to create favorite");
    }
    return this.toFavoriteResponse(favorite);
  }

  update(id: number, userId: number, data: UpdateFavoriteDto): FavoriteResponse {
    if (!favoriteRepository.belongsToUser(id, userId)) {
      throw new Error("Favorite not found or access denied");
    }

    const updated = favoriteRepository.update(id, userId, data);
    if (!updated) {
      throw new Error("Failed to update favorite");
    }

    const favorite = favoriteRepository.findById(id);
    if (!favorite) {
      throw new Error("Favorite not found after update");
    }

    return this.toFavoriteResponse(favorite);
  }

  delete(id: number, userId: number): void {
    if (!favoriteRepository.belongsToUser(id, userId)) {
      throw new Error("Favorite not found or access denied");
    }

    const deleted = favoriteRepository.delete(id, userId);
    if (!deleted) {
      throw new Error("Failed to delete favorite");
    }
  }

  private toFavoriteResponse(favorite: Favorite): FavoriteResponse {
    return {
      id: favorite.id,
      name: favorite.name,
      category: favorite.category,
      created_at: favorite.created_at,
    };
  }
}

export const favoriteService = new FavoriteService();


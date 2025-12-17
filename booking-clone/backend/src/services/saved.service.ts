import { savedRepository, hotelRepository } from "../repositories/index.js";
import type { SavedPropertyResponse, SavedWithHotel } from "../types/index.js";

export class SavedService {
  toggle(userId: number, hotelId: number): { saved: boolean } {
    const hotel = hotelRepository.findById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    const existing = savedRepository.findByUserAndHotel(userId, hotelId);
    if (existing) {
      savedRepository.delete(userId, hotelId);
      return { saved: false };
    } else {
      savedRepository.create(userId, hotelId);
      return { saved: true };
    }
  }

  getUserSaved(userId: number): SavedPropertyResponse[] {
    const saved = savedRepository.findByUserId(userId);
    return saved.map((s) => this.toSavedPropertyResponse(s));
  }

  isSaved(userId: number, hotelId: number): boolean {
    return savedRepository.isSaved(userId, hotelId);
  }

  private toSavedPropertyResponse(saved: SavedWithHotel): SavedPropertyResponse {
    return {
      id: saved.id,
      hotel: {
        id: saved.hotel_id,
        name: saved.hotel_name,
        description: saved.hotel_description,
        location: "",
        city: saved.hotel_city,
        country: saved.hotel_country,
        address: saved.hotel_address,
        pricePerNight: saved.hotel_price_per_night,
        rating: saved.hotel_rating,
        reviewCount: saved.hotel_review_count,
        amenities: JSON.parse(saved.hotel_amenities),
        images: JSON.parse(saved.hotel_images),
        roomsAvailable: 0,
      },
      savedAt: saved.created_at,
    };
  }
}

export const savedService = new SavedService();

import { hotelRepository } from "../repositories/index.js";
import type {
  Hotel,
  HotelSearchParams,
  HotelResponse,
} from "../types/index.js";

export class HotelService {
  search(params: HotelSearchParams): {
    hotels: HotelResponse[];
    total: number;
    page: number;
    limit: number;
  } {
    const { hotels, total } = hotelRepository.search(params);
    return {
      hotels: hotels.map((h) => this.toHotelResponse(h)),
      total,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  }

  getById(id: number): HotelResponse | null {
    const hotel = hotelRepository.findById(id);
    if (!hotel) return null;
    return this.toHotelResponse(hotel);
  }

  getFeatured(): HotelResponse[] {
    const hotels = hotelRepository.getFeatured();
    return hotels.map((h) => this.toHotelResponse(h));
  }

  private toHotelResponse(hotel: Hotel): HotelResponse {
    return {
      id: hotel.id,
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      city: hotel.city,
      country: hotel.country,
      address: hotel.address,
      pricePerNight: hotel.price_per_night,
      rating: hotel.rating,
      reviewCount: hotel.review_count,
      amenities: JSON.parse(hotel.amenities),
      images: JSON.parse(hotel.images),
      roomsAvailable: hotel.rooms_available,
    };
  }
}

export const hotelService = new HotelService();

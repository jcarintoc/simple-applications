export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: number;
}

// Hotel types
export interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  address: string;
  price_per_night: number;
  rating: number;
  review_count: number;
  amenities: string;
  images: string;
  rooms_available: number;
  created_at: string;
}

export interface HotelResponse {
  id: number;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  address: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  images: string[];
  roomsAvailable: number;
}

export interface HotelSearchParams {
  location?: string;
  city?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

// Booking types
export interface Booking {
  id: number;
  user_id: number;
  hotel_id: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  rooms: number;
  total_price: number;
  status: "confirmed" | "cancelled" | "completed";
  created_at: string;
}

export interface CreateBookingDto {
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
  csrfToken: string;
}

export interface BookingResponse {
  id: number;
  hotelId: number;
  hotel?: HotelResponse;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Review types
export interface Review {
  id: number;
  user_id: number;
  hotel_id: number;
  booking_id: number;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  user_name: string;
}

export interface CreateReviewDto {
  hotelId: number;
  bookingId: number;
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  userName: string;
  hotelId: number;
  bookingId: number;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

// Saved property types
export interface SavedProperty {
  id: number;
  user_id: number;
  hotel_id: number;
  created_at: string;
}

export interface SavedWithHotel extends SavedProperty {
  hotel_name: string;
  hotel_description: string;
  hotel_city: string;
  hotel_country: string;
  hotel_address: string;
  hotel_price_per_night: number;
  hotel_rating: number;
  hotel_review_count: number;
  hotel_images: string;
  hotel_amenities: string;
}

export interface SavedPropertyResponse {
  id: number;
  hotel: HotelResponse;
  savedAt: string;
}

// CSRF types
export interface CsrfToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

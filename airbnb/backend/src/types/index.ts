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

export interface Property {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string | null;
  image_url: string | null;
  created_at: string;
}

export interface PropertyWithOwner extends Property {
  owner_name: string;
  owner_email: string;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  image_url?: string;
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {}

export interface Booking {
  id: number;
  property_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface BookingWithProperty extends Booking {
  property_title: string;
  property_location: string;
  property_image_url: string | null;
}

export interface BookingWithGuest extends Booking {
  guest_name: string;
  guest_email: string;
}

export interface CreateBookingDto {
  property_id: number;
  check_in: string;
  check_out: string;
  guests: number;
}

export interface Review {
  id: number;
  property_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  user_name: string;
  user_email: string;
}

export interface CreateReviewDto {
  rating: number;
  comment: string;
}

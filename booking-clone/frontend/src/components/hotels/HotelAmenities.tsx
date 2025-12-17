import {
  Wifi,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  Wine,
  Sparkles,
  Car,
  Coffee,
  Tv,
  AirVent,
  type LucideIcon,
} from "lucide-react";

const amenityIcons: Record<string, LucideIcon> = {
  "Free WiFi": Wifi,
  WiFi: Wifi,
  Pool: Waves,
  Gym: Dumbbell,
  Restaurant: UtensilsCrossed,
  Bar: Wine,
  Spa: Sparkles,
  Parking: Car,
  Breakfast: Coffee,
  TV: Tv,
  "Air Conditioning": AirVent,
};

interface HotelAmenitiesProps {
  amenities: string[];
}

export function HotelAmenities({ amenities }: HotelAmenitiesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {amenities.map((amenity) => {
        const Icon = amenityIcons[amenity] || Sparkles;
        return (
          <div key={amenity} className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}

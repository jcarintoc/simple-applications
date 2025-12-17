import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "./SaveButton";
import type { Hotel } from "@/lib/api/types";

interface HotelCardProps {
  hotel: Hotel;
  showSaveButton?: boolean;
}

export function HotelCard({ hotel, showSaveButton = true }: HotelCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/hotels/${hotel.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={hotel.images[0] || "/placeholder.svg"}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {showSaveButton && (
            <div
              className="absolute right-2 top-2"
              onClick={(e) => e.preventDefault()}
            >
              <SaveButton hotelId={hotel.id} />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/hotels/${hotel.id}`}>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{hotel.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({hotel.reviewCount})
              </span>
            </div>
          </div>
          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">
              {hotel.city}, {hotel.country}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{hotel.amenities.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold">${hotel.pricePerNight}</span>
            <span className="text-sm text-muted-foreground">/ night</span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

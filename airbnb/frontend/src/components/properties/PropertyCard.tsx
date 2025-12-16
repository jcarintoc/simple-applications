import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { PropertyWithOwner } from "@/lib/api/types";

interface PropertyCardProps {
  property: PropertyWithOwner;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const amenities = property.amenities ? JSON.parse(property.amenities) : [];

  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden p-0 gap-0">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={property.image_url || "https://via.placeholder.com/800x600"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">{property.title}</h3>
            <span className="text-lg font-bold text-primary ml-2 whitespace-nowrap">
              ${property.price_per_night}
              <span className="text-sm font-normal text-muted-foreground">/night</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span>{property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
            <span>{property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}</span>
            <span>Up to {property.max_guests} {property.max_guests === 1 ? "guest" : "guests"}</span>
          </div>
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {amenities.slice(0, 3).map((amenity: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-muted px-2 py-1 rounded-md"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

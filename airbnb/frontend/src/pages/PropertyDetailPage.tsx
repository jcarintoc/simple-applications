import { useParams } from "react-router-dom";
import { useProperty, useReviews } from "@/lib/query";
import { BookingForm } from "@/components/booking";
import { ReviewList, ReviewForm } from "@/components/reviews";
import { StarRating } from "@/components/reviews/StarRating";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Bed, Bath } from "lucide-react";
import { useUser } from "@/lib/query";
import { Card } from "@/components/ui/card";

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ? parseInt(id, 10) : 0;
  const { data: property, isLoading: propertyLoading } = useProperty(propertyId);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(propertyId);
  const { data: userData } = useUser();

  if (propertyLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Property not found</p>
      </div>
    );
  }

  const amenities = property.amenities ? JSON.parse(property.amenities) : [];
  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const currentUserId = userData?.user.id;
  const hasReviewed = reviews?.some((r) => r.user_id === currentUserId) || false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
          {averageRating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} size={16} />
              <span className="text-sm">({reviews?.length || 0} reviews)</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={property.image_url || "https://via.placeholder.com/1200x800"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Property details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{property.max_guests}</p>
                  <p className="text-sm text-muted-foreground">Guests</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{property.bedrooms}</p>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{property.bathrooms}</p>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {reviewsLoading ? (
              <p className="text-muted-foreground">Loading reviews...</p>
            ) : (
              <ReviewList reviews={reviews || []} propertyId={propertyId} />
            )}
          </div>

          {userData && !hasReviewed && currentUserId !== property.owner_id && (
            <>
              <Separator />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Write a review</h2>
                <Card className="p-6">
                  <ReviewForm propertyId={propertyId} />
                </Card>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingForm property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}

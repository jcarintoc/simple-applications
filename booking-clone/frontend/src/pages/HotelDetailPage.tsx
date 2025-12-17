import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingForm } from "@/components/booking";
import { SaveButton, HotelAmenities } from "@/components/hotels";
import { ReviewList } from "@/components/reviews";
import { useHotel, useHotelReviews } from "@/lib/query";

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const hotelId = parseInt(id || "0");
  const { data: hotelData, isLoading } = useHotel(hotelId);
  const hotel = hotelData?.hotel;
  const { data: reviewsData } = useHotelReviews(hotelId);

  const [currentImage, setCurrentImage] = useState(0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Hotel not found</h2>
        <Link to="/hotels" className="text-primary hover:underline mt-2 inline-block">
          Browse all hotels
        </Link>
      </div>
    );
  }

  const images = hotel.images.length > 0 ? hotel.images : ["/placeholder.svg"];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-8 p-4">
      {/* Image Gallery */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={images[currentImage]}
          alt={hotel.name}
          className="w-full h-[400px] object-cover"
        />
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentImage ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentImage(idx)}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 right-4">
          <SaveButton hotelId={hotel.id} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Hotel Info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.city}, {hotel.country}</span>
                </div>
              </div>
              {hotel.rating && (
                <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-lg">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          <Card className="p-4">
            <CardContent className="p-0">
              <h2 className="text-xl font-semibold mb-3">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {hotel.description}
              </p>
            </CardContent>
          </Card>

          <HotelAmenities amenities={hotel.amenities} />

          {/* Reviews Section */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h2 className="text-xl font-semibold">
                Reviews ({reviewsData?.reviews.length || 0})
              </h2>

              {/* {userData?.user && (
                <ReviewForm hotelId={hotel.id} />
              )} */}

              <ReviewList reviews={reviewsData?.reviews || []} />
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1">
          <div className="sticky top-4">
            <BookingForm hotel={hotel} />
          </div>
        </div>
      </div>
    </div>
  );
}

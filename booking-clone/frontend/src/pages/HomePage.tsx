import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchForm } from "@/components/search";
import { HotelGrid } from "@/components/hotels";
import { useHotelSearch } from "@/lib/query";
import type { SearchParams, SearchFormInput } from "@/lib/api/types";

const popularDestinations = [
  { city: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400" },
  { city: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
  { city: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400" },
  { city: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useState<SearchParams>({});
  const { data: hotelsData } = useHotelSearch({ ...searchParams, limit: 8 });

  const handleSearch = (data: SearchFormInput) => {
    const queryParams = new URLSearchParams();
    if (data.location) queryParams.set("location", data.location);
    if (data.checkIn) queryParams.set("checkIn", format(data.checkIn, "yyyy-MM-dd"));
    if (data.checkOut) queryParams.set("checkOut", format(data.checkOut, "yyyy-MM-dd"));
    if (data.guests) queryParams.set("guests", data.guests.toString());
    navigate(`/hotels?${queryParams.toString()}`);
  };

  const handleDestinationClick = (city: string) => {
    navigate(`/hotels?location=${encodeURIComponent(city)}`);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mx-4 -mt-6 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find your perfect stay
          </h1>
          <p className="text-lg text-muted-foreground">
            Search deals on hotels, homes, and much more...
          </p>
          <div className="max-w-3xl mx-auto">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Popular Destinations</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularDestinations.map((dest) => (
            <Card
              key={dest.city}
              className="cursor-pointer overflow-hidden group"
              onClick={() => handleDestinationClick(dest.city)}
            >
              <CardContent className="p-0 relative">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold">{dest.city}</span>
                  </div>
                  <span className="text-sm text-white/80">{dest.country}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Featured Properties</h2>
        </div>
        <HotelGrid hotels={hotelsData?.hotels || []} isLoading={false} />
      </section>
    </div>
  );
}

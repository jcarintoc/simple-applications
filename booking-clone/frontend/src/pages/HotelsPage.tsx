import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SearchForm } from "@/components/search";
import { HotelGrid } from "@/components/hotels";
import { useHotelSearch } from "@/lib/query";
import type { SearchParams, SearchFormInput } from "@/lib/api/types";

export function HotelsPage() {
  const [urlParams, setUrlParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: urlParams.get("location") || undefined,
    checkIn: urlParams.get("checkIn") || undefined,
    checkOut: urlParams.get("checkOut") || undefined,
    guests: urlParams.get("guests") ? parseInt(urlParams.get("guests")!) : undefined,
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Debounce price range changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const { data: hotelsData, isLoading } = useHotelSearch({
    ...searchParams,
    minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : undefined,
    maxPrice: debouncedPriceRange[1] < 1000 ? debouncedPriceRange[1] : undefined,
    sortBy: sortBy !== "recommended" ? sortBy : undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.location) params.set("location", searchParams.location);
    if (searchParams.checkIn) params.set("checkIn", searchParams.checkIn);
    if (searchParams.checkOut) params.set("checkOut", searchParams.checkOut);
    if (searchParams.guests) params.set("guests", searchParams.guests.toString());
    setUrlParams(params);
  }, [searchParams, setUrlParams]);

  const handleSearch = (data: SearchFormInput) => {
    setSearchParams({
      ...data,
      checkIn: data.checkIn ? format(data.checkIn, "yyyy-MM-dd") : undefined,
      checkOut: data.checkOut ? format(data.checkOut, "yyyy-MM-dd") : undefined,
      sortBy: searchParams.sortBy,
    });
  };

  return (
    <div className="space-y-6">
      <SearchForm
        onSearch={handleSearch}
        defaultValues={{
          location: searchParams.location,
          checkIn: searchParams.checkIn ? new Date(searchParams.checkIn) : undefined,
          checkOut: searchParams.checkOut ? new Date(searchParams.checkOut) : undefined,
          guests: searchParams.guests,
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground">
          {hotelsData?.total || 0} properties found
          {searchParams.location && ` in "${searchParams.location}"`}
        </p>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-4">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-4">
                  <Label>Price Range (per night)</Label>
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <HotelGrid hotels={hotelsData?.hotels || []} isLoading={isLoading} />
    </div>
  );
}

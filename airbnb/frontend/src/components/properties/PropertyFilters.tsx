import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { PropertyFilters } from "@/lib/api/properties";

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

export function PropertyFiltersComponent({ filters, onFiltersChange }: PropertyFiltersProps) {
  const [location, setLocation] = useState(filters.location || "");
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || "");
  const [maxGuests, setMaxGuests] = useState(filters.maxGuests?.toString() || "");

  const handleApply = () => {
    onFiltersChange({
      location: location || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      maxGuests: maxGuests ? parseInt(maxGuests, 10) : undefined,
    });
  };

  const handleClear = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setMaxGuests("");
    onFiltersChange({});
  };

  return (
    <div className="bg-background border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Location</label>
          <Input
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Min Price ($/night)</label>
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Max Price ($/night)</label>
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Guests</label>
          <Input
            type="number"
            placeholder="Min guests"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            min="1"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleApply} className="flex-1 md:flex-none">
          <Search className="h-4 w-4" />
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { PropertyGrid, PropertyFiltersComponent } from "@/components/properties";
import { useProperties } from "@/lib/query/properties";
import type { PropertyFilters } from "@/lib/api/properties";

export function HomePage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { data: properties, isLoading } = useProperties(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find your perfect stay</h1>
        <p className="text-muted-foreground">Discover unique places to stay and experiences around the world</p>
      </div>

      <PropertyFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      ) : (
        <PropertyGrid properties={properties || []} />
      )}
    </div>
  );
}

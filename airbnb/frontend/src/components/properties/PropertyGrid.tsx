import { PropertyCard } from "./PropertyCard";
import type { PropertyWithOwner } from "@/lib/api/types";

interface PropertyGridProps {
  properties: PropertyWithOwner[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <p className="text-muted-foreground">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventFilter } from "@/lib/api";

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: EventFilter;
  onFilterChange: (value: EventFilter) => void;
}

const filterOptions: { value: EventFilter; label: string }[] = [
  { value: "all", label: "All Upcoming" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
];

export function EventFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: EventFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className={cn(
              "rounded-full transition-all",
              filter === option.value
                ? "shadow-sm"
                : "hover:bg-accent/50"
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

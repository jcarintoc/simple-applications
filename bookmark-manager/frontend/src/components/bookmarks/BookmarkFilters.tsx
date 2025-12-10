import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import type { Tag } from "../../lib/api";

interface BookmarkFiltersProps {
  availableTags: Tag[];
  selectedTags: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTagsChange: (tags: string[]) => void;
}

export function BookmarkFilters({
  availableTags,
  selectedTags,
  searchQuery,
  onSearchChange,
  onTagsChange,
}: BookmarkFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter((t) => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const clearFilters = () => {
    setLocalSearch("");
    onSearchChange("");
    onTagsChange([]);
  };

  const hasActiveFilters = localSearch || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Search</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Clear
            </button>
          )}
        </div>
        <Input
          type="text"
          placeholder="Find bookmarks..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="bg-white"
        />
      </div>

      {availableTags.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <Badge
                  key={tag.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => toggleTag(tag.name)}
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

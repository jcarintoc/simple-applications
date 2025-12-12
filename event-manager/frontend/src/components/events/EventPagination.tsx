import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "@/lib/api";

interface EventPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function EventPagination({ pagination, onPageChange }: EventPaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        {total} event{total !== 1 ? "s" : ""} total
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground px-2">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

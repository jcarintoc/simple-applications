import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventTag } from "@/lib/api";

interface EventTagBadgeProps {
  tag: EventTag;
  className?: string;
}

export const tagConfig: Record<EventTag, { label: string; className: string }> = {
  work: {
    label: "Work",
    className: "bg-blue-100 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800",
  },
  personal: {
    label: "Personal",
    className: "bg-green-100 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800",
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-100 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800",
  },
};

export function EventTagBadge({ tag, className }: EventTagBadgeProps) {
  const config = tagConfig[tag];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

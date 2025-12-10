import { BookmarkCard } from "./BookmarkCard";
import type { BookmarkWithTags, UpdateBookmarkDto } from "../../lib/api";

interface BookmarkListProps {
  bookmarks: BookmarkWithTags[];
  onUpdate: (id: number, data: UpdateBookmarkDto) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export function BookmarkList({ bookmarks, onUpdate, onDelete, isLoading }: BookmarkListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-slate-500 font-medium">Loading...</div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No bookmarks yet</h3>
        <p className="text-sm text-slate-500">Start saving your favorite links</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

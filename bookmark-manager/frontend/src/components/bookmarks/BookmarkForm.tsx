import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { CreateBookmarkDto, UpdateBookmarkDto } from "../../lib/api";

interface BookmarkFormProps {
  initialData?: {
    url: string;
    title: string;
    description?: string;
    tags?: string[];
  };
  onSubmit: (data: CreateBookmarkDto | UpdateBookmarkDto) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BookmarkForm({ initialData, onSubmit, onCancel, isLoading }: BookmarkFormProps) {
  const [url, setUrl] = useState(initialData?.url || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url || !title) {
      setError("URL and title are required");
      return;
    }

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await onSubmit({
        url,
        title,
        description: description || undefined,
        tags: tagArray.length > 0 ? tagArray : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save bookmark");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          placeholder="My Bookmark"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          type="text"
          placeholder="javascript, react, tutorial"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Bookmark"}
        </Button>
      </div>
    </form>
  );
}

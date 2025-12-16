import type { StoryWithAuthor } from "@/lib/api/types";

interface StoryListProps {
  stories: StoryWithAuthor[];
  onStoryClick?: (userId: number) => void;
}

export function StoryList({ stories, onStoryClick }: StoryListProps) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No active stories available.</p>
      </div>
    );
  }

  // Group stories by user
  const storiesByUser = new Map<number, StoryWithAuthor[]>();
  stories.forEach((story) => {
    const userStories = storiesByUser.get(story.user_id) || [];
    userStories.push(story);
    storiesByUser.set(story.user_id, userStories);
  });

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from(storiesByUser.entries()).map(([userId, userStories]) => {
        const firstStory = userStories[0];
        return (
          <button
            key={userId}
            onClick={() => onStoryClick?.(userId)}
            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <div className="h-16 w-16 rounded-full border-2 border-primary overflow-hidden">
              <img
                src={firstStory.image_url}
                alt={firstStory.author_name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-center max-w-[60px] truncate">
              {firstStory.author_name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

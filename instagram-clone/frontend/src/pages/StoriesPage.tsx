import { useState } from "react";
import { StoryList, StoryViewer } from "@/components/stories";
import { useActiveStories } from "@/lib/query/stories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoryWithAuthor } from "@/lib/api/types";

export function StoriesPage() {
  const { data: stories, isLoading } = useActiveStories();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading stories...</p>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No active stories available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group stories by user for display
  const storiesByUser = new Map<number, StoryWithAuthor[]>();
  stories.forEach((story) => {
    const userStories = storiesByUser.get(story.user_id) || [];
    userStories.push(story);
    storiesByUser.set(story.user_id, userStories);
  });

  const handleStoryClick = (userId: number) => {
    // Find first story index for this user
    const userStories = storiesByUser.get(userId) || [];
    if (userStories.length > 0) {
      const index = stories.indexOf(userStories[0]);
      setCurrentStoryIndex(index);
      setViewerOpen(true);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <StoryList stories={stories} onStoryClick={handleStoryClick} />
        </CardContent>
      </Card>

      <StoryViewer
        stories={stories}
        currentIndex={currentStoryIndex}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

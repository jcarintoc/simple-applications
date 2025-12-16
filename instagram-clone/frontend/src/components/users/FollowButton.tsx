import { Button } from "@/components/ui/button";
import { useIsFollowing, useFollowUser, useUnfollowUser } from "@/lib/query/follows";

interface FollowButtonProps {
  userId: number;
}

export function FollowButton({ userId }: FollowButtonProps) {
  const { data: followData, isLoading } = useIsFollowing(userId);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const isFollowing = followData || false;
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = () => {
    if (isFollowing) {
      unfollowMutation.mutate(userId);
    } else {
      followMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

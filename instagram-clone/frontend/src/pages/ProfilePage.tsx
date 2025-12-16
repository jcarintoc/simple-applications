import { useParams } from "react-router-dom";
import { UserProfile } from "@/components/users";
import { usePostsByUser } from "@/lib/query/posts";
import { useFollowing, useFollowers } from "@/lib/query/follows";
import { useUser as useCurrentUser } from "@/lib/query";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const profileUserId = userId ? parseInt(userId, 10) : 0;
  const { data: posts, isLoading: isLoadingPosts } = usePostsByUser(profileUserId);
  const { data: following } = useFollowing(profileUserId);
  const { data: followers } = useFollowers(profileUserId);
  const { data: currentUser } = useCurrentUser();

  // For now, we'll use a placeholder name and email
  // In a real app, we'd fetch user info from an API
  const userName = "User"; // Would come from API
  const userEmail = "user@example.com"; // Would come from API

  if (isLoadingPosts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  // Try to get user name from posts if available
  const displayName = posts && posts.length > 0 ? posts[0].author_name : userName;
  const displayEmail = posts && posts.length > 0 ? posts[0].author_email : userEmail;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <UserProfile
        userId={profileUserId}
        userName={displayName}
        userEmail={displayEmail}
        posts={posts || []}
        followersCount={followers?.length || 0}
        followingCount={following?.length || 0}
      />
    </div>
  );
}

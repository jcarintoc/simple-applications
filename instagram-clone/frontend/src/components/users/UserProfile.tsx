import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowButton } from "./FollowButton";
import { useUser } from "@/lib/query";
import type { PostWithAuthor } from "@/lib/api/types";

interface UserProfileProps {
  userId: number;
  userName: string;
  userEmail: string;
  posts: PostWithAuthor[];
  followersCount?: number;
  followingCount?: number;
}

export function UserProfile({
  userId,
  userName,
  userEmail,
  posts,
  followersCount = 0,
  followingCount = 0,
}: UserProfileProps) {
  const { data: userData } = useUser();
  const isOwnProfile = userData?.user?.id === userId;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">{userName}</CardTitle>
                <p className="text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            {!isOwnProfile && <FollowButton userId={userId} />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div>
              <span className="font-semibold">{posts.length}</span>
              <span className="text-muted-foreground ml-1">posts</span>
            </div>
            <div>
              <span className="font-semibold">{followersCount}</span>
              <span className="text-muted-foreground ml-1">followers</span>
            </div>
            <div>
              <span className="font-semibold">{followingCount}</span>
              <span className="text-muted-foreground ml-1">following</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`#`}
                className="aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
              >
                <img
                  src={post.image_url}
                  alt={post.caption || "Post"}
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

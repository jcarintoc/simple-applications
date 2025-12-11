import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/users/UserAvatar";
import { FollowButton } from "@/components/users/FollowButton";
import { PostList } from "@/components/posts/PostList";
import { useUserProfile } from "@/lib/query/users";
import { useUserPosts } from "@/lib/query/posts";
import { useFollowers, useFollowing } from "@/lib/query/follows";
import { useUser } from "@/lib/query";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useState } from "react";

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const userIdNum = parseInt(userId || "0");
  const [activeTab, setActiveTab] = useState<
    "posts" | "followers" | "following"
  >("posts");

  const { data: currentUser } = useUser();
  const { data: profileData, isLoading: profileLoading } =
    useUserProfile(userIdNum);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userIdNum);
  const { data: followersData, isLoading: followersLoading } =
    useFollowers(userIdNum);
  const { data: followingData, isLoading: followingLoading } =
    useFollowing(userIdNum);

  const isOwnProfile = currentUser?.user.id === userIdNum;

  if (profileLoading) {
    return (
      <div>
        <div className="border-b">
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const user = profileData.user;

  return (
    <div>
      {/* Profile Header */}
      <div className="border-b border-x border-t-0">
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex justify-between items-start">
              <UserAvatar name={user.name} className="h-18 w-18" />
              {!isOwnProfile && <FollowButton userId={userIdNum} />}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground text-[15px]">
                @{user.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground text-[15px] mt-3">
            <Calendar className="h-4 w-4" />
            <span>
              Joined{" "}
              {new Date(user.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex gap-5 mt-3 text-[15px]">
            <button className="hover:underline">
              <span className="font-bold text-foreground">
                {user.followingCount}
              </span>{" "}
              <span className="text-muted-foreground">Following</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-foreground">
                {user.followerCount}
              </span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <nav className="flex border-t">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex items-center justify-center h-[53px] hover:bg-muted/50 transition-colors relative ${
              activeTab === "posts" ? "" : ""
            }`}
          >
            <span
              className={`font-medium ${
                activeTab === "posts" ? "" : "text-muted-foreground"
              }`}
            >
              Posts
            </span>
            {activeTab === "posts" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 flex items-center justify-center h-[53px] hover:bg-muted/50 transition-colors relative ${
              activeTab === "followers" ? "" : ""
            }`}
          >
            <span
              className={`font-medium ${
                activeTab === "followers" ? "" : "text-muted-foreground"
              }`}
            >
              Followers
            </span>
            {activeTab === "followers" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 flex items-center justify-center h-[53px] hover:bg-muted/50 transition-colors relative ${
              activeTab === "following" ? "" : ""
            }`}
          >
            <span
              className={`font-medium ${
                activeTab === "following" ? "" : "text-muted-foreground"
              }`}
            >
              Following
            </span>
            {activeTab === "following" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" && (
        <PostList posts={postsData?.posts || []} isLoading={postsLoading} />
      )}

      {activeTab === "followers" && (
        <div className="border-x">
          {followersLoading ? (
            <div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b px-4 py-3">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : followersData?.followers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No followers yet</p>
            </div>
          ) : (
            <div>
              {followersData?.followers.map((follower) => (
                <article
                  key={follower.id}
                  className="border-b px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-3">
                    <Link to={`/users/${follower.id}`}>
                      <UserAvatar name={follower.name} className="h-10 w-10" />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/users/${follower.id}`}
                        className="font-bold hover:underline"
                      >
                        {follower.name}
                      </Link>
                      <p className="text-muted-foreground text-[15px]">
                        @{follower.username}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div className="border-x">
          {followingLoading ? (
            <div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b px-4 py-3">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : followingData?.following.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Not following anyone yet</p>
            </div>
          ) : (
            <div>
              {followingData?.following.map((following) => (
                <article
                  key={following.id}
                  className="border-b px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-3">
                    <Link to={`/users/${following.id}`}>
                      <UserAvatar name={following.name} className="h-10 w-10" />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/users/${following.id}`}
                        className="font-bold hover:underline"
                      >
                        {following.name}
                      </Link>
                      <p className="text-muted-foreground text-[15px]">
                        @{following.username}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

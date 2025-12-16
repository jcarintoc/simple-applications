import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "./FollowButton";
import type { User } from "@/lib/api/types";
import { useUser } from "@/lib/query";

interface UserSearchResultProps {
  user: User;
}

export function UserSearchResult({ user }: UserSearchResultProps) {
  const { data: currentUser } = useUser();
  const isOwnProfile = currentUser?.user?.id === user.id;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Link to={`/profile/${user.id}`} className="flex items-center gap-3 flex-1">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </Link>
          {!isOwnProfile && <FollowButton userId={user.id} />}
        </div>
      </CardContent>
    </Card>
  );
}

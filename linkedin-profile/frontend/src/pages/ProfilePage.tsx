import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ProfileHeader, ProfileSummary } from "@/components/profile";
import { ConnectionButton } from "@/components/connections";
import { useProfile } from "@/lib/query/profiles";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const userIdNum = parseInt(userId || "0");
  const { data: profile, isLoading, error } = useProfile(userIdNum);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <Card>
            <Skeleton className="h-32 rounded-t-lg" />
            <div className="px-6 pb-6">
              <Skeleton className="h-32 w-32 rounded-full -mt-16 mb-4" />
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <Card className="p-6 text-center">
            <p className="text-red-500">Failed to load profile</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 space-y-6">
        <Card>
          <ProfileHeader profile={profile}>
            <ConnectionButton userId={profile.user_id} />
          </ProfileHeader>
        </Card>
        <ProfileSummary summary={profile.summary} />
      </div>
    </div>
  );
}

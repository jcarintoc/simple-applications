import { MapPin, Building2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/api/types";

interface ProfileHeaderProps {
  profile: Profile;
  children?: React.ReactNode;
}

export function ProfileHeader({ profile, children }: ProfileHeaderProps) {
  const initials = profile.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg"
        style={
          profile.banner_image_url
            ? { backgroundImage: `url(${profile.banner_image_url})`, backgroundSize: "cover" }
            : undefined
        }
      />

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="relative -mt-16 mb-4">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            <AvatarImage src={profile.profile_image_url || undefined} alt={profile.user.name} />
            <AvatarFallback className="text-2xl bg-gray-200">
              {initials || <User className="h-12 w-12 text-gray-500" />}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.user.name}</h1>
            {profile.headline && (
              <p className="text-lg text-gray-600 mt-1">{profile.headline}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              )}
              {profile.industry && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {profile.industry}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

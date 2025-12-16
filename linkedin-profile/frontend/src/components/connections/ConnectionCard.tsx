import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { ConnectionResponse } from "@/lib/api/types";

interface ConnectionCardProps {
  connection: ConnectionResponse;
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const initials = connection.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link to={`/profile/${connection.user_id}`} className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={connection.profile_image_url || undefined} alt={connection.name} />
            <AvatarFallback className="bg-gray-200">
              {initials || <User className="h-6 w-6 text-gray-500" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{connection.name}</h3>
            {connection.headline && (
              <p className="text-sm text-gray-500 truncate">{connection.headline}</p>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

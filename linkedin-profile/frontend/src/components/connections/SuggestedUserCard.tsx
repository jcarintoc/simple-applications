import { Link } from "react-router-dom";
import { User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSendConnectionRequest } from "@/lib/query/connections";
import { toast } from "sonner";
import type { SuggestedUser } from "@/lib/api/types";

interface SuggestedUserCardProps {
  user: SuggestedUser;
}

export function SuggestedUserCard({ user }: SuggestedUserCardProps) {
  const sendRequest = useSendConnectionRequest();

  const handleConnect = () => {
    sendRequest.mutate(user.id, {
      onSuccess: () => {
        toast.success("Connection request sent!");
      },
      onError: () => {
        toast.error("Failed to send connection request");
      },
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow p-2 gap-0">
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${user.id}`}>
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {user.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${user.id}`} className="hover:underline">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 truncate">
              {user.headline || "LinkedIn Member"}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-3"
          onClick={handleConnect}
          disabled={sendRequest.isPending}
        >
          <UserPlus className="h-4 w-4" />
          {sendRequest.isPending ? "Sending..." : "Connect"}
        </Button>
      </CardContent>
    </Card>
  );
}

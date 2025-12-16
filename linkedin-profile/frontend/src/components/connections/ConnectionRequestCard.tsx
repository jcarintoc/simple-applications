import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAcceptConnection, useRejectConnection } from "@/lib/query/connections";
import type { ConnectionRequest } from "@/lib/api/types";

interface ConnectionRequestCardProps {
  request: ConnectionRequest;
  type: "received" | "sent";
}

export function ConnectionRequestCard({ request, type }: ConnectionRequestCardProps) {
  const accept = useAcceptConnection();
  const reject = useRejectConnection();

  const initials = request.requester_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAccept = async () => {
    try {
      await accept.mutateAsync(request.id);
      toast.success("Connection accepted");
    } catch {
      toast.error("Failed to accept connection");
    }
  };

  const handleReject = async () => {
    try {
      await reject.mutateAsync(request.id);
      toast.success("Connection rejected");
    } catch {
      toast.error("Failed to reject connection");
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Link to={`/profile/${request.requester_id}`}>
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={request.requester_profile_image_url || undefined}
                alt={request.requester_name}
              />
              <AvatarFallback className="bg-gray-200">
                {initials || <User className="h-6 w-6 text-gray-500" />}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${request.requester_id}`}>
              <h3 className="font-medium text-gray-900 truncate hover:underline">
                {request.requester_name}
              </h3>
            </Link>
            {request.requester_headline && (
              <p className="text-sm text-gray-500 truncate">{request.requester_headline}</p>
            )}
          </div>
          {type === "received" && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAccept} disabled={accept.isPending}>
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                disabled={reject.isPending}
              >
                Ignore
              </Button>
            </div>
          )}
          {type === "sent" && (
            <span className="text-sm text-gray-500">Pending</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

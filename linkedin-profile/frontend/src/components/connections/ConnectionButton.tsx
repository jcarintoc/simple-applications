import { UserPlus, UserCheck, Clock, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useConnectionStatus,
  useSendConnectionRequest,
  useAcceptConnection,
  useRejectConnection,
  useRemoveConnection,
} from "@/lib/query/connections";

interface ConnectionButtonProps {
  userId: number;
}

export function ConnectionButton({ userId }: ConnectionButtonProps) {
  const { data: status, isLoading } = useConnectionStatus(userId);
  const sendRequest = useSendConnectionRequest();
  const accept = useAcceptConnection();
  const reject = useRejectConnection();
  const remove = useRemoveConnection();

  if (isLoading) {
    return <Button variant="outline" size="sm" disabled>Loading...</Button>;
  }

  if (!status || status.status === "self") {
    return null;
  }

  const handleConnect = async () => {
    try {
      await sendRequest.mutateAsync(userId);
      toast.success("Connection request sent");
    } catch {
      toast.error("Failed to send connection request");
    }
  };

  const handleAccept = async () => {
    if (!status.connection_id) return;
    try {
      await accept.mutateAsync(status.connection_id);
      toast.success("Connection accepted");
    } catch {
      toast.error("Failed to accept connection");
    }
  };

  const handleReject = async () => {
    if (!status.connection_id) return;
    try {
      await reject.mutateAsync(status.connection_id);
      toast.success("Connection rejected");
    } catch {
      toast.error("Failed to reject connection");
    }
  };

  const handleRemove = async () => {
    if (!status.connection_id) return;
    try {
      await remove.mutateAsync(status.connection_id);
      toast.success("Connection removed");
    } catch {
      toast.error("Failed to remove connection");
    }
  };

  switch (status.status) {
    case "none":
      return (
        <Button
          size="sm"
          onClick={handleConnect}
          disabled={sendRequest.isPending}
        >
          <UserPlus className="h-4 w-4" />
          Connect
        </Button>
      );
    case "pending_sent":
      return (
        <Button variant="outline" size="sm" disabled>
          <Clock className="h-4 w-4" />
          Pending
        </Button>
      );
    case "pending_received":
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleAccept}
            disabled={accept.isPending}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={reject.isPending}
          >
            Reject
          </Button>
        </div>
      );
    case "connected":
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          disabled={remove.isPending}
        >
          <UserCheck className="h-4 w-4" />
          Connected
        </Button>
      );
    default:
      return null;
  }
}

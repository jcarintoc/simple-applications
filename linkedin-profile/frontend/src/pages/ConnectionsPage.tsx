import { Users, UserPlus, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectionCard, ConnectionRequestCard } from "@/components/connections";
import { useConnections, usePendingRequests, useSentRequests } from "@/lib/query/connections";

export function ConnectionsPage() {
  const { data: connections, isLoading: loadingConnections } = useConnections();
  const { data: pendingRequests, isLoading: loadingPending } = usePendingRequests();
  const { data: sentRequests, isLoading: loadingSent } = useSentRequests();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Network</h1>
          <p className="text-gray-600">Manage your professional connections</p>
        </div>

        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Connections
              {connections && connections.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {connections.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Received
              {pendingRequests && pendingRequests.length > 0 && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Sent
              {sentRequests && sentRequests.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {sentRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="mt-6">
            {loadingConnections ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : connections && connections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {connections.map((connection) => (
                  <ConnectionCard key={connection.id} connection={connection} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No connections yet</p>
                <p className="text-sm">Start building your network!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {loadingPending ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : pendingRequests && pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <ConnectionRequestCard key={request.id} request={request} type="received" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending requests</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-6">
            {loadingSent ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : sentRequests && sentRequests.length > 0 ? (
              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <ConnectionRequestCard key={request.id} request={request} type="sent" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sent requests</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { User, Users, Briefcase, FileText, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/lib/query";
import { useConnections, usePendingRequests } from "@/lib/query/connections";
import { useMyApplications } from "@/lib/query/jobs";
import { useSuggestedUsers } from "@/lib/query/profiles";
import { SuggestedUserCard } from "@/components/connections/SuggestedUserCard";

export function DashboardPage() {
  const { data, isLoading } = useUser();
  const { data: connections } = useConnections();
  const { data: pendingRequests } = usePendingRequests();
  const { data: applications } = useMyApplications();
  const { data: suggestedUsers } = useSuggestedUsers(4);

  const limitedSuggestedUsers = suggestedUsers
    ? suggestedUsers.slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const user = data?.user;

  const quickLinks = [
    {
      title: "My Profile",
      description: "View and edit your profile",
      icon: User,
      href: "/profile/me",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "My Network",
      description: `${connections?.length || 0} connections${
        pendingRequests?.length ? `, ${pendingRequests.length} pending` : ""
      }`,
      icon: Users,
      href: "/connections",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Jobs",
      description: "Browse available positions",
      icon: Briefcase,
      href: "/jobs",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Applications",
      description: `${applications?.length || 0} applications submitted`,
      icon: FileText,
      href: "/applications",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your profile
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/5 flex flex-col gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} to={link.href}>
                  <Card className="hover:shadow-md transition-shadow h-full p-3 gap-0">
                    <CardHeader className="p-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${link.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {link.title}
                          </CardTitle>
                          <CardDescription>{link.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex items-center text-sm text-blue-600">
                        View
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="md:w-2/5 space-y-4">
            {/* Pending Requests Alert */}
            {pendingRequests && pendingRequests.length > 0 && (
              <Card className="border-orange-200 bg-orange-50 p-3 gap-0">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-700">
                      You have <strong>{pendingRequests.length}</strong> pending
                      connection
                      {pendingRequests.length > 1 ? "s" : ""} to review
                    </div>
                    <Link
                      to="/connections"
                      className="text-sm text-orange-600 hover:underline flex items-center gap-1"
                    >
                      Review
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggested People */}
            {suggestedUsers && suggestedUsers.length > 0 && (
              <div className="p-4 bg-card border shadow rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    People you may know
                  </h2>
                  <Link
                    to="/all-connections"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    See all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-4">
                  {limitedSuggestedUsers.map((user) => (
                    <SuggestedUserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

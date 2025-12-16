import { Link, useNavigate } from "react-router-dom";
import { FileText, Clock, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyApplications } from "@/lib/query/jobs";

const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  reviewing: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
};

export function MyApplicationsPage() {
  const { data: applications, isLoading, error } = useMyApplications();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Failed to load applications</p>
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app.id}
                onClick={() => navigate(`/jobs/${app.job_post_id}`)}
                className="hover:shadow-md transition-shadow p-4 gap-0 cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {app.job_title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Building2 className="h-3 w-3" />
                        <span>{app.company_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          Applied{" "}
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        statusColors[app.status] || "bg-gray-100 text-gray-700"
                      }
                    >
                      {statusLabels[app.status] || app.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No applications yet</p>
            <Link to="/jobs" className="text-blue-600 hover:underline text-sm">
              Browse job listings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

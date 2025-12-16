import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplyJobDialog } from "@/components/jobs";
import { useJobById } from "@/lib/query/jobs";

const employmentTypeLabels: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const experienceLevelLabels: Record<string, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  executive: "Executive",
};

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const jobIdNum = parseInt(jobId || "0");
  const { data: job, isLoading, error } = useJobById(jobIdNum);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-4">
          <Card className="p-6 text-center">
            <p className="text-red-500">Failed to load job details</p>
            <Link to="/jobs">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 space-y-6">
        <Link to="/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{job.job_title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{job.company_name}</span>
                </div>
              </div>
              <ApplyJobDialog job={job} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {job.employment_type && (
                <Badge variant="secondary">
                  <Briefcase className="h-3 w-3" />
                  {employmentTypeLabels[job.employment_type]}
                </Badge>
              )}
              {job.experience_level && (
                <Badge variant="outline">
                  {experienceLevelLabels[job.experience_level]}
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

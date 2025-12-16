import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobPost } from "@/lib/api/types";

interface JobCardProps {
  job: JobPost;
}

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

export function JobCard({ job }: JobCardProps) {
  return (
    <Link to={`/jobs/${job.id}`}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg leading-tight">{job.job_title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{job.company_name}</p>
            </div>
            {job.has_applied && (
              <Badge variant="secondary" className="shrink-0">
                <CheckCircle className="h-3 w-3" />
                Applied
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {job.employment_type && (
              <Badge variant="outline">
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
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

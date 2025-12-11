import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSurveys } from "@/lib/query";
import { SurveyCard } from "@/components/surveys";
import {
  Globe,
  Loader2,
  AlertCircle,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export function BrowseSurveysPage() {
  const { data: surveys = [], isLoading, error } = useSurveys();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="size-6 text-primary" />
              <h1 className="text-3xl font-bold">All Surveys</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Browse and participate in surveys
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading surveys...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="size-12 text-destructive mb-4" />
              <p className="text-destructive">Failed to load surveys</p>
            </CardContent>
          </Card>
        ) : surveys.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="size-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-2">No surveys available</p>
              <p className="text-sm text-muted-foreground">
                Be the first to create a survey!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSurveyResults } from "@/lib/query";
import {
  BarChart3,
  Loader2,
  AlertCircle,
  ArrowLeft,
  User,
  Calendar,
  Users,
  Vote,
} from "lucide-react";

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const surveyId = parseInt(id || "0", 10);

  const { data: survey, isLoading, error } = useSurveyResults(surveyId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="size-12 text-destructive mb-4" />
              <p className="text-destructive mb-4">Survey not found</p>
              <Button asChild variant="outline">
                <Link to="/browse">
                  <ArrowLeft className="size-4" />
                  Browse Surveys
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalVotes = survey.results.reduce((sum, r) => sum + r.count, 0);
  const maxVotes = Math.max(...survey.results.map((r) => r.count));

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/browse">
            <ArrowLeft className="size-4" />
            Back to Surveys
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="size-4" />
                <span className="text-sm">Results</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="size-3" />
                {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{survey.question}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {survey.author_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(survey.created_at).toLocaleDateString()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {survey.results.map((result, index) => {
              const isWinner = result.count === maxVotes && result.count > 0;
              return (
                <div
                  key={index}
                  className={`space-y-2 rounded-lg border p-4 ${
                    isWinner ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium flex items-center gap-2">
                      {result.option}
                      {isWinner && (
                        <Badge variant="default" className="text-xs">
                          Leading
                        </Badge>
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {result.count} {result.count === 1 ? "vote" : "votes"} ({result.percentage}%)
                    </span>
                  </div>
                  <Progress value={result.percentage} className="h-3" />
                </div>
              );
            })}

            {totalVotes === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No votes yet. Be the first to vote!
              </div>
            )}

            <div className="pt-4 border-t">
              <Button asChild className="w-full">
                <Link to={`/survey/${surveyId}`}>
                  <Vote className="size-4" />
                  Vote on this Survey
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


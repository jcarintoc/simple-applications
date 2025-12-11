import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  User,
  Calendar,
  BarChart3,
  Vote,
  CheckCircle2,
} from "lucide-react";
import type { Survey } from "@/lib/api";
import { DeleteSurveyDialog } from "./DeleteSurveyDialog";
import { hasVoted } from "@/lib/voted-surveys";
import { useUser } from "@/lib/query";

interface SurveyCardProps {
  survey: Survey;
  showDelete?: boolean;
}

export function SurveyCard({ survey, showDelete = false }: SurveyCardProps) {
  const { data: userData } = useUser();
  const userId = userData?.user?.id;
  const voted = hasVoted(survey.id, userId);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClipboardList className="size-4" />
            <span className="text-sm">Survey</span>
          </div>
          <div className="flex items-center gap-2">
            {voted && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-500/90">
                <CheckCircle2 className="size-3 mr-1" />
                Voted
              </Badge>
            )}
            <Badge variant="outline">
              {survey.response_count} {survey.response_count === 1 ? "response" : "responses"}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{survey.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {survey.options.map((option, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {option}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="size-3" />
            {survey.author_name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(survey.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          {voted ? (
            <Button asChild variant="secondary" size="sm" className="flex-1" disabled>
              <span>
                <CheckCircle2 className="mr-2 size-4 text-green-500" />
                Voted
              </span>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link to={`/survey/${survey.id}`}>
                <Vote className="mr-2 size-4" />
                Vote
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/survey/${survey.id}/results`}>
              <BarChart3 className="mr-2 size-4" />
              Results
            </Link>
          </Button>
          {showDelete && <DeleteSurveyDialog surveyId={survey.id} surveyQuestion={survey.question} />}
        </div>
      </CardContent>
    </Card>
  );
}


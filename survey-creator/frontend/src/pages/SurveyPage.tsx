import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSurvey, useSubmitResponse, useCSRFToken, useUser } from "@/lib/query";
import { hasVoted, markAsVoted } from "@/lib/voted-surveys";
import {
  ClipboardList,
  Loader2,
  AlertCircle,
  ArrowLeft,
  User,
  Calendar,
  Vote,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export function SurveyPage() {
  const { id } = useParams<{ id: string }>();
  const surveyId = parseInt(id || "0", 10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  const { data: userData } = useUser();
  const userId = userData?.user?.id;
  const { data: survey, isLoading, error } = useSurvey(surveyId);
  const submitResponse = useSubmitResponse();
  useCSRFToken();

  // Check if user already voted on mount
  useEffect(() => {
    if (surveyId && userId) {
      setAlreadyVoted(hasVoted(surveyId, userId));
    }
  }, [surveyId, userId]);

  const handleSubmit = async () => {
    if (selectedOption === null || alreadyVoted || !userId) return;

    try {
      await submitResponse.mutateAsync({
        surveyId,
        selectedOption: parseInt(selectedOption, 10),
      });
      markAsVoted(surveyId, userId);
      setSubmitted(true);
    } catch (err) {
      // Check if the error is "already responded"
      const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      if (errorMessage?.includes("already responded")) {
        // Mark as voted and show the already voted screen
        markAsVoted(surveyId, userId);
        setAlreadyVoted(true);
      } else {
        console.error("Failed to submit response:", err);
      }
    }
  };

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

  if (submitted || alreadyVoted) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/browse">
              <ArrowLeft className="size-4" />
              Back to Surveys
            </Link>
          </Button>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {submitted ? "Thank You!" : "Already Voted"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {submitted
                  ? "Your response has been submitted successfully."
                  : "You have already voted on this survey."}
              </p>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link to="/browse">
                    <ArrowLeft className="size-4" />
                    Browse More
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={`/survey/${surveyId}/results`}>
                    <BarChart3 className="size-4" />
                    View Results
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <ClipboardList className="size-4" />
              <span className="text-sm">Survey</span>
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
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectedOption || ""}
              onValueChange={setSelectedOption}
            >
              {survey.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOption(index.toString())}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={selectedOption === null || submitResponse.isPending}
                className="flex-1"
              >
                <Vote className="size-4" />
                {submitResponse.isPending ? "Submitting..." : "Submit Vote"}
              </Button>
              <Button asChild variant="outline">
                <Link to={`/survey/${surveyId}/results`}>
                  <BarChart3 className="size-4" />
                  View Results
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


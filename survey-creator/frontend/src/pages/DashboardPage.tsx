import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser, useLogout, useMySurveys, useCSRFToken } from "@/lib/query";
import { CreateSurveyDialog, SurveyCard } from "@/components/surveys";
import {
  ClipboardList,
  LogOut,
  User,
  Loader2,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { data: userData, isLoading: userLoading } = useUser();
  const { data: surveys = [], isLoading: surveysLoading, error } = useMySurveys();
  const logoutMutation = useLogout();
  useCSRFToken(); // Pre-fetch CSRF token

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const user = userData?.user;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="size-6 text-primary" />
              <h1 className="text-3xl font-bold">My Surveys</h1>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <User className="size-4" />
              Welcome back, {user?.name}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/browse">Browse All</Link>
            </Button>
            <CreateSurveyDialog />
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="size-4" />
              {logoutMutation.isPending ? "..." : "Logout"}
            </Button>
          </div>
        </div>

        {surveysLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading your surveys...</p>
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
              <PlusCircle className="size-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-2">No surveys yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first survey to get started!
              </p>
              <CreateSurveyDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} showDelete />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteSurvey } from "@/lib/query";

interface DeleteSurveyDialogProps {
  surveyId: number;
  surveyQuestion: string;
}

export function DeleteSurveyDialog({ surveyId, surveyQuestion }: DeleteSurveyDialogProps) {
  const deleteSurvey = useDeleteSurvey();

  const handleDelete = async () => {
    try {
      await deleteSurvey.mutateAsync(surveyId);
    } catch (error) {
      console.error("Failed to delete survey:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Survey</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{surveyQuestion}"? This will also delete all responses. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSurvey.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteSurvey.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


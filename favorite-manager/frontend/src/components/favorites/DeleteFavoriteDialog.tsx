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
import { Trash2 } from "lucide-react";
import { useDeleteFavorite } from "@/lib/query";
import type { Favorite } from "@/lib/api";

interface DeleteFavoriteDialogProps {
  favorite: Favorite;
}

export function DeleteFavoriteDialog({ favorite }: DeleteFavoriteDialogProps) {
  const deleteFavorite = useDeleteFavorite();

  const handleDelete = async () => {
    try {
      await deleteFavorite.mutateAsync(favorite.id);
    } catch (error) {
      // Error handling is done by React Query
      console.error("Failed to delete favorite:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="p-1 border rounded-sm hover:bg-red-500 hover:text-white  duration-200 transition-colors">
          <Trash2 className="size-3" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Favorite</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{favorite.name}"? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteFavorite.isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteFavorite.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

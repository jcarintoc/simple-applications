import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateFavorite } from "@/lib/query";
import {
  createFavoriteSchema,
  type Favorite,
  type CreateFavoriteInput,
} from "@/lib/api";

const CATEGORIES: CreateFavoriteInput["category"][] = [
  "Movie",
  "Song",
  "Book",
  "Game",
  "Show",
  "Other",
];

interface EditFavoriteDialogProps {
  favorite: Favorite;
}

export function EditFavoriteDialog({ favorite }: EditFavoriteDialogProps) {
  const [open, setOpen] = useState(false);
  const updateFavorite = useUpdateFavorite();

  const form = useForm<CreateFavoriteInput>({
    resolver: zodResolver(createFavoriteSchema),
    defaultValues: {
      name: favorite.name,
      category: favorite.category,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: favorite.name,
        category: favorite.category,
      });
    }
  }, [open, favorite, form]);

  const onSubmit = async (data: CreateFavoriteInput) => {
    try {
      await updateFavorite.mutateAsync({
        id: favorite.id,
        data,
      });
      setOpen(false);
    } catch (error) {
      // Error handling is done by React Query
      console.error("Failed to update favorite:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1 border rounded-sm hover:bg-blue-500 hover:text-white duration-200 transition-colors">
          <Pencil className="size-3" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Favorite</DialogTitle>
          <DialogDescription>
            Update the details of your favorite item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateFavorite.isPending}>
                {updateFavorite.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

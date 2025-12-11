import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Palette, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ColorPicker } from "./ColorPicker";
import { useCreatePalette } from "@/lib/query";
import { createPaletteSchema, type CreatePaletteInput } from "@/lib/api";
import { toast } from "sonner";

export function PaletteBuilder() {
  const createPalette = useCreatePalette();

  const form = useForm<CreatePaletteInput>({
    resolver: zodResolver(createPaletteSchema),
    defaultValues: {
      name: "",
      colors: [],
    },
  });

  const colors = form.watch("colors");

  const handleColorsChange = (newColors: string[]) => {
    form.setValue("colors", newColors, { shouldValidate: true });
  };

  const onSubmit = async (data: CreatePaletteInput) => {
    try {
      await createPalette.mutateAsync(data);
      toast.success("Palette saved successfully!");
      form.reset();
    } catch {
      toast.error("Failed to save palette");
    }
  };

  return (
    <Card className="border-dashed border-black/50 p-4 sticky top-28">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-violet-500 via-pink-500 to-orange-400 flex items-center justify-center">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Create Palette</CardTitle>
            <CardDescription>Pick colors and save your palette</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palette Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ocean Sunset" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Colors</FormLabel>
              <ColorPicker colors={colors} onColorsChange={handleColorsChange} />
              {form.formState.errors.colors && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.colors.message || "At least one color is required"}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createPalette.isPending}
            >
              {createPalette.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Palette
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


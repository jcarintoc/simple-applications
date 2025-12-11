import { Palette, FolderOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaletteCard } from "./PaletteCard";
import { usePalettes } from "@/lib/query";

export function SavedPalettes() {
  const { data, isLoading, isError } = usePalettes();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent>
          <p className="text-center text-destructive">
            Failed to load palettes. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const palettes = data?.palettes ?? [];

  return (
    <Card className="p-3 border-none">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          <div className="h-11 w-11 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">My Palettes</CardTitle>
            <CardDescription>
              {palettes.length === 0
                ? "No palettes saved yet"
                : `${palettes.length} palette${
                    palettes.length === 1 ? "" : "s"
                  } saved`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {palettes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No palettes yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Create your first color palette using the builder above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {palettes.map((palette) => (
              <PaletteCard key={palette.id} palette={palette} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

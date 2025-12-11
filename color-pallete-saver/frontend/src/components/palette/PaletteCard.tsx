import { useState } from "react";
import { Copy, Trash2, MoreVertical, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeletePalette } from "@/lib/query";
import type { Palette } from "@/lib/api";
import { toast } from "sonner";

interface PaletteCardProps {
  palette: Palette;
}

export function PaletteCard({ palette }: PaletteCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const deletePalette = useDeletePalette();

  const handleCopyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
    toast.success(`Copied ${color}`);
  };

  const handleCopyAllColors = async () => {
    const colorsText = palette.colors.join(", ");
    await navigator.clipboard.writeText(colorsText);
    toast.success("All colors copied to clipboard");
  };

  const handleDelete = async () => {
    try {
      await deletePalette.mutateAsync(palette.id);
      toast.success("Palette deleted");
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Failed to delete palette");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate text color for contrast
  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all shadow-none p-3 gap-2 ">
        <CardHeader className="p-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold line-clamp-1">
                {palette.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {formatDate(palette.createdAt)}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyAllColors}>
                  <Copy className="h-4 w-4" />
                  Copy all colors
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete palette
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Color Preview Bar */}
          <div className="h-16 rounded-lg overflow-hidden flex shadow-inner ring-1 ring-black/10 mb-3">
            {palette.colors.map((color, index) => (
              <div
                key={`preview-${color}-${index}`}
                className="flex-1 transition-all"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Color Chips */}
          <div className="flex flex-wrap gap-1.5">
            <TooltipProvider>
              {palette.colors.map((color, index) => (
                <Tooltip key={`${color}-${index}`}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleCopyColor(color)}
                      className="h-8 px-2 rounded-md flex items-center gap-1.5 text-xs font-mono transition-all ring-1 ring-black/10"
                      style={{
                        backgroundColor: color,
                        color: getContrastColor(color),
                      }}
                    >
                      {copiedColor === color ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        color
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{palette.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              color palette.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePalette.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deletePalette.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


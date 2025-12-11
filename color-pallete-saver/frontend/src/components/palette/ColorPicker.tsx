import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColorPickerProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  maxColors?: number;
}

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16",
  "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9",
  "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF",
  "#EC4899", "#F43F5E", "#78716C", "#64748B", "#1E293B",
];

export function ColorPicker({ colors, onColorsChange, maxColors = 10 }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState("#");
  const [inputError, setInputError] = useState("");
  const colorInputRef = useRef<HTMLInputElement>(null);

  const hexPattern = /^#[0-9A-Fa-f]{6}$/;

  const validateAndNormalizeHex = (value: string): string | null => {
    // Add # if missing
    let hex = value.startsWith("#") ? value : `#${value}`;
    
    // Expand shorthand (e.g., #FFF -> #FFFFFF)
    if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    if (hexPattern.test(hex)) {
      return hex.toUpperCase();
    }
    return null;
  };

  const addColor = (color: string) => {
    const normalized = validateAndNormalizeHex(color);
    if (!normalized) {
      setInputError("Invalid hex color");
      return;
    }

    if (colors.length >= maxColors) {
      setInputError(`Maximum ${maxColors} colors allowed`);
      return;
    }

    if (colors.includes(normalized)) {
      setInputError("Color already added");
      return;
    }

    onColorsChange([...colors, normalized]);
    setHexInput("#");
    setInputError("");
  };

  const removeColor = (index: number) => {
    onColorsChange(colors.filter((_, i) => i !== index));
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    setInputError("");
  };

  const handleHexSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (hexInput.length > 1) {
      addColor(hexInput);
    }
  };

  // Only update hex input preview - user must click "+" to add
  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value.toUpperCase();
    setHexInput(color);
    setInputError("");
  };

  // Calculate text color for contrast
  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  useEffect(() => {
    if (inputError) {
      const timer = setTimeout(() => setInputError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [inputError]);

  return (
    <div className="space-y-4">
      {/* Selected Colors */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Selected Colors ({colors.length}/{maxColors})
            </span>
            {colors.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onColorsChange([])}
                className="text-muted-foreground hover:text-destructive h-auto py-1 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              {colors.map((color, index) => (
                <Tooltip key={`${color}-${index}`}>
                  <TooltipTrigger asChild>
                    <div
                      className="group relative h-10 w-10 rounded-lg cursor-pointer shadow-sm transition-transform hover:scale-110 ring-1 ring-black/10"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        navigator.clipboard.writeText(color);
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeColor(index);
                        }}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">{color}</p>
                    <p className="text-xs text-muted-foreground">Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          {/* Color Preview Bar */}
          <div className="h-12 rounded-lg overflow-hidden flex shadow-inner ring-1 ring-black/10">
            {colors.map((color, index) => (
              <div
                key={`preview-${color}-${index}`}
                className="flex-1 flex items-center justify-center transition-all"
                style={{ backgroundColor: color }}
              >
                <span
                  className="font-mono text-[10px] opacity-0 hover:opacity-100 transition-opacity"
                  style={{ color: getContrastColor(color) }}
                >
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Color Section */}
      <div className="space-y-3">
        <span className="text-sm font-medium">Add Color</span>
        
        {/* Hex Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="#FFFFFF"
              value={hexInput}
              onChange={handleHexInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleHexSubmit(e);
                }
              }}
              className="font-mono pr-12"
              maxLength={7}
            />
            <input
              ref={colorInputRef}
              type="color"
              value={hexInput.length === 7 ? hexInput : "#000000"}
              onChange={handleNativeColorChange}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer rounded border-0 p-0"
            />
          </div>
          <Button
            type="button"
            size="icon"
            disabled={colors.length >= maxColors}
            variant="secondary"
            onClick={handleHexSubmit}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {inputError && (
          <p className="text-destructive text-xs">{inputError}</p>
        )}

        {/* Preset Colors */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Quick picks</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => addColor(color)}
                disabled={colors.includes(color) || colors.length >= maxColors}
                className="h-6 w-6 rounded transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ring-1 ring-black/10"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


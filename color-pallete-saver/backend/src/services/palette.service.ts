import { paletteRepository } from "../repositories/index.js";
import type {
  Palette,
  PaletteResponse,
  CreatePaletteDto,
  UpdatePaletteDto,
} from "../types/index.js";

export class PaletteService {
  getByUserId(userId: number): PaletteResponse[] {
    const palettes = paletteRepository.findByUserId(userId);
    return palettes.map(this.toPaletteResponse);
  }

  getById(id: number, userId: number): PaletteResponse | null {
    const palette = paletteRepository.findByIdAndUserId(id, userId);
    if (!palette) return null;
    return this.toPaletteResponse(palette);
  }

  create(userId: number, data: CreatePaletteDto): PaletteResponse {
    this.validateColors(data.colors);
    this.validateName(data.name);

    const id = paletteRepository.create(userId, data);
    const palette = paletteRepository.findById(id);

    if (!palette) {
      throw new Error("Failed to create palette");
    }

    return this.toPaletteResponse(palette);
  }

  update(id: number, userId: number, data: UpdatePaletteDto): PaletteResponse | null {
    if (data.colors) {
      this.validateColors(data.colors);
    }
    if (data.name) {
      this.validateName(data.name);
    }

    const success = paletteRepository.update(id, userId, data);
    if (!success) return null;

    const palette = paletteRepository.findByIdAndUserId(id, userId);
    if (!palette) return null;

    return this.toPaletteResponse(palette);
  }

  delete(id: number, userId: number): boolean {
    return paletteRepository.delete(id, userId);
  }

  private validateColors(colors: string[]): void {
    if (!Array.isArray(colors) || colors.length === 0) {
      throw new Error("Colors must be a non-empty array");
    }

    if (colors.length > 10) {
      throw new Error("Maximum 10 colors per palette");
    }

    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    for (const color of colors) {
      if (!hexPattern.test(color)) {
        throw new Error(`Invalid hex color: ${color}`);
      }
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Palette name is required");
    }

    if (name.length > 50) {
      throw new Error("Palette name must be 50 characters or less");
    }
  }

  private toPaletteResponse(palette: Palette): PaletteResponse {
    return {
      id: palette.id,
      name: palette.name,
      colors: JSON.parse(palette.colors) as string[],
      createdAt: palette.created_at,
    };
  }
}

export const paletteService = new PaletteService();


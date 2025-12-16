import { propertyRepository } from "../repositories/property.repository.js";
import type { Property, PropertyWithOwner, CreatePropertyDto, UpdatePropertyDto } from "../types/index.js";

export class PropertyService {
  getProperties(filters?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    maxGuests?: number;
  }): PropertyWithOwner[] {
    return propertyRepository.findAll(filters);
  }

  getPropertyById(id: number): PropertyWithOwner | null {
    return propertyRepository.findById(id) || null;
  }

  getPropertiesByOwner(ownerId: number): PropertyWithOwner[] {
    return propertyRepository.findByOwner(ownerId);
  }

  createProperty(ownerId: number, data: CreatePropertyDto): PropertyWithOwner {
    const id = propertyRepository.create(ownerId, data);
    const property = propertyRepository.findById(id);
    if (!property) {
      throw new Error("Failed to create property");
    }
    return property;
  }

  updateProperty(id: number, ownerId: number, data: UpdatePropertyDto): boolean {
    const property = propertyRepository.findById(id);
    if (!property || property.owner_id !== ownerId) {
      return false;
    }
    return propertyRepository.update(id, data);
  }

  deleteProperty(id: number, ownerId: number): boolean {
    const property = propertyRepository.findById(id);
    if (!property || property.owner_id !== ownerId) {
      return false;
    }
    return propertyRepository.delete(id);
  }
}

export const propertyService = new PropertyService();

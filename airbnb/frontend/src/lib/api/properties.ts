import { apiClient } from "./client";
import {
  type PropertyWithOwner,
  type CreatePropertyInput,
  type UpdatePropertyInput,
  propertiesResponseSchema,
  propertyResponseSchema,
  propertySchema,
} from "./types";

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  maxGuests?: number;
}

export const propertiesApi = {
  getProperties: async (filters?: PropertyFilters): Promise<PropertyWithOwner[]> => {
    const params = new URLSearchParams();
    if (filters?.location) params.append("location", filters.location);
    if (filters?.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.maxGuests !== undefined) params.append("maxGuests", filters.maxGuests.toString());

    const response = await apiClient.get(`/properties?${params.toString()}`);
    return propertiesResponseSchema.parse(response.data).properties;
  },

  getPropertyById: async (id: number): Promise<PropertyWithOwner> => {
    const response = await apiClient.get(`/properties/${id}`);
    return propertyResponseSchema.parse(response.data).property;
  },

  getMyProperties: async (): Promise<PropertyWithOwner[]> => {
    const response = await apiClient.get("/properties/owner/my-properties");
    return propertiesResponseSchema.parse(response.data).properties;
  },

  createProperty: async (data: CreatePropertyInput): Promise<PropertyWithOwner> => {
    const response = await apiClient.post("/properties", data);
    return propertyResponseSchema.parse(response.data).property;
  },

  updateProperty: async (id: number, data: UpdatePropertyInput): Promise<PropertyWithOwner> => {
    const response = await apiClient.put(`/properties/${id}`, data);
    return propertyResponseSchema.parse(response.data).property;
  },

  deleteProperty: async (id: number): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },
};

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProperty, useUpdateProperty } from "@/lib/query/properties";
import { updatePropertyInputSchema, type UpdatePropertyInput } from "@/lib/api/types";
import { Plus, X } from "lucide-react";

export function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const propertyId = id ? parseInt(id, 10) : 0;
  const { data: property, isLoading: isLoadingProperty } = useProperty(propertyId);
  const updatePropertyMutation = useUpdateProperty();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdatePropertyInput>({
    resolver: zodResolver(updatePropertyInputSchema),
    defaultValues: {
      amenities: [],
    },
  });

  // Load property data into form when it's available
  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        location: property.location,
        price_per_night: property.price_per_night,
        max_guests: property.max_guests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        image_url: property.image_url || undefined,
        amenities: property.amenities ? JSON.parse(property.amenities) : [],
      });
    }
  }, [property, reset]);

  const amenities = watch("amenities") || [];
  const [newAmenity, setNewAmenity] = useState("");

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setValue("amenities", [...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setValue(
      "amenities",
      amenities.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (data: UpdatePropertyInput) => {
    updatePropertyMutation.mutate(
      { id: propertyId, data },
      {
        onSuccess: () => {
          navigate("/my-listings");
        },
      }
    );
  };

  if (isLoadingProperty) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-destructive">Property not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>

      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-destructive" : ""}
                placeholder="Beautiful beachfront villa"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
                placeholder="Describe your property..."
                rows={5}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register("location")}
                className={errors.location ? "border-destructive" : ""}
                placeholder="City, State or City, Country"
              />
              {errors.location && (
                <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_night">Price per Night ($) *</Label>
                <Input
                  id="price_per_night"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price_per_night", { valueAsNumber: true })}
                  className={errors.price_per_night ? "border-destructive" : ""}
                />
                {errors.price_per_night && (
                  <p className="text-sm text-destructive mt-1">{errors.price_per_night.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_guests">Max Guests *</Label>
                <Input
                  id="max_guests"
                  type="number"
                  min="1"
                  {...register("max_guests", { valueAsNumber: true })}
                  className={errors.max_guests ? "border-destructive" : ""}
                />
                {errors.max_guests && (
                  <p className="text-sm text-destructive mt-1">{errors.max_guests.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  {...register("bedrooms", { valueAsNumber: true })}
                  className={errors.bedrooms ? "border-destructive" : ""}
                />
                {errors.bedrooms && (
                  <p className="text-sm text-destructive mt-1">{errors.bedrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  {...register("bathrooms", { valueAsNumber: true })}
                  className={errors.bathrooms ? "border-destructive" : ""}
                />
                {errors.bathrooms && (
                  <p className="text-sm text-destructive mt-1">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                {...register("image_url")}
                className={errors.image_url ? "border-destructive" : ""}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image_url && (
                <p className="text-sm text-destructive mt-1">{errors.image_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  placeholder="Add amenity (e.g., WiFi, Pool)"
                />
                <Button type="button" onClick={addAmenity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-muted px-3 py-1 rounded-md"
                  >
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updatePropertyMutation.isPending}>
                {updatePropertyMutation.isPending ? "Updating..." : "Update Listing"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/my-listings")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

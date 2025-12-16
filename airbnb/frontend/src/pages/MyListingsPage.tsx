import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useMyProperties, useDeleteProperty } from "@/lib/query/properties";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useState } from "react";

export function MyListingsPage() {
  const { data: properties, isLoading, error } = useMyProperties();
  const deletePropertyMutation = useDeleteProperty();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (propertyToDelete !== null) {
      deletePropertyMutation.mutate(propertyToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setPropertyToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading your properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">
          Error loading properties:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Listings</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button asChild>
          <Link to="/create-listing">
            <Plus className="h-4 w-4" />
            Create Listing
          </Link>
        </Button>
      </div>

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="flex flex-col p-4 gap-0">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={
                    property.image_url || "https://via.placeholder.com/800x600"
                  }
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="line-clamp-2">{property.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <p className="text-sm text-muted-foreground mb-2">
                  {property.location}
                </p>
                <p className="text-lg font-bold text-primary">
                  ${property.price_per_night}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / night
                  </span>
                </p>
              </CardContent>
              <CardFooter className="flex gap-2 p-0">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/properties/${property.id}`}>View</Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/properties/${property.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <AlertDialog
                  open={deleteDialogOpen && propertyToDelete === property.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setDeleteDialogOpen(false);
                      setPropertyToDelete(null);
                    }
                  }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(property.id)}
                    disabled={deletePropertyMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your property listing &quot;{property.title}
                        &quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven't listed any properties yet.
          </p>
          <Button asChild>
            <Link to="/create-listing">Create your first listing</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

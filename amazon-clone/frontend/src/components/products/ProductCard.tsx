import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { useAddToCart } from "@/lib/query/cart";
import type { Product } from "@/lib/api/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate(
      { product_id: product.id, quantity: 1 },
      {
        onSuccess: () => {
          // Could show a toast notification here
        },
      }
    );
  };

  const rating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow p-0 gap-0">
      <Link to={`/products/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{product.name}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={rating} size={14} />
              <span className="text-sm text-muted-foreground">
                {rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
          {product.stock > 0 ? (
            <p className="text-sm text-green-600 mt-1">In Stock</p>
          ) : (
            <p className="text-sm text-red-600 mt-1">Out of Stock</p>
          )}
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || addToCartMutation.isPending}
          className="w-full"
        >
          {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
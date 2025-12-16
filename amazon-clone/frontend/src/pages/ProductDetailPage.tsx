import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/products/StarRating";
import { useProduct } from "@/lib/query/products";
import { useAddToCart } from "@/lib/query/cart";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : 0;
  const { data: product, isLoading } = useProduct(productId);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate(
      { product_id: product.id, quantity: 1 },
      {
        onSuccess: () => {
          navigate("/cart");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const rating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {rating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={rating} />
              <span className="text-sm text-muted-foreground">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}

          <div className="text-3xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>

          {product.stock > 0 ? (
            <p className="text-green-600">
              In Stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-red-600">Out of Stock</p>
          )}

          {product.description && (
            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addToCartMutation.isPending}
            className="w-full md:w-auto"
            size="lg"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-6 border p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="p-0 gap-0 border-0 shadow-none"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.rating} size={16} />
                        <span className="font-semibold">
                          {review.reviewer_name}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

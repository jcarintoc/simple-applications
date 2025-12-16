import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/lib/query/cart";
import { useCheckout } from "@/lib/query/orders";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading } = useCart();
  const checkoutMutation = useCheckout();

  const handleCheckout = () => {
    checkoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/orders");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <CartSummary items={cartItems} />

      <div className="mt-6 space-y-4">
        <Button
          onClick={handleCheckout}
          disabled={checkoutMutation.isPending}
          className="w-full"
          size="lg"
        >
          {checkoutMutation.isPending ? "Processing..." : "Place Order"}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/cart")}
          className="w-full"
        >
          Back to Cart
        </Button>
      </div>
    </div>
  );
}
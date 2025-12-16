import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart, useClearCart } from "@/lib/query/cart";

export function CartPage() {
  const navigate = useNavigate();
  const { data: cartItems, isLoading } = useCart();
  const clearCartMutation = useClearCart();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          onClick={() => clearCartMutation.mutate()}
          disabled={clearCartMutation.isPending}
        >
          {clearCartMutation.isPending ? "Clearing..." : "Clear Cart"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div>
          <CartSummary items={cartItems} />
          <Button
            onClick={() => navigate("/checkout")}
            className="w-full mt-4"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
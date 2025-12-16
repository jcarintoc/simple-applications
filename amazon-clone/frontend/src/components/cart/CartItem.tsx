import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateCartItem, useRemoveCartItem } from "@/lib/query/cart";
import type { CartItem } from "@/lib/api/types";

interface CartItemProps {
  item: CartItem;
}

export function CartItem({ item }: CartItemProps) {
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ id: item.id, data: { quantity: newQuantity } });
  };

  const handleRemove = () => {
    removeMutation.mutate(item.id);
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 border-b">
      <Link to={`/products/${item.product.id}`} className="shrink-0">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-24 h-24 object-cover rounded"
        />
      </Link>
      <div className="flex-1 flex flex-col gap-2">
        <Link to={`/products/${item.product.id}`}>
          <h3 className="font-semibold hover:text-primary">{item.product.name}</h3>
        </Link>
        <p className="text-muted-foreground">${item.product.price.toFixed(2)}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || updateMutation.isPending}
              className="h-8 w-8"
            >
              -
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={updateMutation.isPending}
              className="h-8 w-8"
            >
              +
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={removeMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg">${subtotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
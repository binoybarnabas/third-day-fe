import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/common/sheet";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/common/button";
import { ScrollArea } from "@/components/common/scroll-area";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { AppRoutes } from "@/types/enums";
import Link from "next/link";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, isLoading } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col pr-0 sm:pr-6">
        <SheetHeader className="px-1">
          <SheetTitle className="font-heading text-2xl font-bold uppercase">Cart ({items.length})</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4 mt-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-secondary">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-foreground">
                      <h3 className="line-clamp-2 pr-4">
                        <Link href={`/product/${item.id}`} onClick={() => setIsCartOpen(false)}>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="ml-4">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.selectedColor} / {item.selectedSize}
                    </p>

                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-secondary"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-secondary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-destructive hover:text-destructive/80 text-xs uppercase tracking-wide"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="space-y-4 pr-6 mt-6 pt-6 border-t border-border">
            <div className="flex justify-between text-base font-medium text-foreground">
              <p className="uppercase tracking-wide">Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="grid gap-2">
              <Button
                className="w-full h-12 text-base uppercase tracking-widest font-bold rounded-none"
                onClick={() => setIsCartOpen(false)}
                asChild
              >
                <Link href={AppRoutes.CHECKOUT}>Checkout</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base uppercase tracking-widest font-bold rounded-none"
                onClick={() => setIsCartOpen(false)}
                asChild
              >
                <Link href={AppRoutes.CART}>View Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

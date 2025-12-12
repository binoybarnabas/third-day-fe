"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api"; // Assumes your API functions and Product type are here

// --- Type Definitions ---

// Extends the base product with cart-specific details
export interface CartItem extends api.Product {
  id: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: api.Product, size: string, color: string) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- CartProvider Component ---

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Fetch cart from backend using useQuery
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.fetchCart(),
  });

  // 2. Transform backend cart data to frontend CartItem[] format
  const items: CartItem[] = (cartData || []).map(item => ({
    ...item.product,
    id: item.id, // ID of the cart item itself, not the product
    quantity: item.quantity,
    selectedSize: item.selectedSize,
    selectedColor: item.selectedColor,
  }));

  // 3. Define Mutations (Add, Update, Remove, Clear)

  // Add to cart mutation
  const addMutation = useMutation({
    mutationFn: (data: { product: api.Product; size: string; color: string }) => 
      api.addToCart({
        productId: data.product.id,
        selectedSize: data.size,
        selectedColor: data.color,
        quantity: 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // Re-fetch cart data
      setIsCartOpen(true); // Open cart on successful addition
    },
  });

  // Update quantity mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; quantity: number }) =>
      api.updateCartItem(data.id, data.quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Remove from cart mutation
  const removeMutation = useMutation({
    mutationFn: (id: number) => api.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart mutation
  const clearMutation = useMutation({
    mutationFn: () => api.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 4. Context Functions (calling mutations)
  
  const addItem = async (product: api.Product, size: string, color: string) => {
    await addMutation.mutateAsync({ product, size, color });
  };

  const removeItem = async (id: number) => {
    await removeMutation.mutateAsync(id);
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    await updateMutation.mutateAsync({ id, quantity });
  };

  const clearCart = async () => {
    await clearMutation.mutateAsync();
  };

  // 5. Derived State (Total and Count)
  const cartTotal = items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  // 6. Provide Context Value
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// --- useCart Hook ---

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
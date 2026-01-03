"use client"

import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api"; // Assumes your API functions are here
import { useToast } from "@/hooks/use-toast";

// --- Type Definitions --- 

interface WishlistContextType {
  items: number[]; // Array of product IDs in the wishlist
  addItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// --- WishlistProvider Component ---

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 1. Fetch wishlist from backend
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.fetchWishlist(),
    // Assumes api.fetchWishlist() returns an array of product IDs (number[])
  });

  // 2. Add to wishlist mutation
  const addMutation = useMutation({
    mutationFn: (productId: number) => api.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] }); // Re-fetch wishlist data
      toast({ title: "Added to wishlist" });
    },
  });

  // 3. Remove from wishlist mutation
  const removeMutation = useMutation({
    mutationFn: (productId: number) => api.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] }); // Re-fetch wishlist data
      toast({ title: "Removed from wishlist" });
    },
  });

  // 4. Context Functions

  const addItem = async (productId: number) => {
    // Prevent redundant API call if item is already present (optimistic check)
    if (!items.includes(productId)) {
      await addMutation.mutateAsync(productId);
    }
  };

  const removeItem = async (productId: number) => {
    await removeMutation.mutateAsync(productId);
  };

  const toggleWishlist = async (productId: number) => {
    if (items.includes(productId)) {
      await removeItem(productId);
    } else {
      await addItem(productId);
    }
  };

  const isInWishlist = (productId: number) => items.includes(productId);

  // 5. Provide Context Value

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

// --- useWishlist Hook ---

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
// components/providers/app-providers.tsx
"use client";

import { queryClient } from "@/lib/queryClient"; // Assume this is accessible
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/common/toaster";
import { TooltipProvider } from "@/components/common/tooltip";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            {children}
            <Toaster /> {/* Toaster is placed globally */}
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
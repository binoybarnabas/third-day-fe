"use client";
import { Layout } from "@/components/ui/layout";
import { ProductCard } from "@/components/ui/product-card";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { useWishlist } from "@/lib/wishlist";
import { Button } from "@/components/common/button";
import { AppRoutes } from "@/types/enums";
import { Skeleton } from "@/components/common/skeleton";
import Link from "next/link";

export default function Wishlist() {
  const { items } = useWishlist();

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.fetchProducts,
  });

  const wishlistProducts = allProducts.filter(p => items.includes(p.id));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-heading font-bold uppercase tracking-tight mb-8">
          My Wishlist ({items.length})
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30">
            <h3 className="text-xl font-bold uppercase mb-4">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-8">Save items you love to buy later.</p>
            <Button asChild className="uppercase tracking-widest rounded-none h-12 px-8">
              <Link href={AppRoutes.HOME}>Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

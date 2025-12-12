"use client";
import { Layout } from "@/components/ui/layout";
import { Button } from "@/components/common/button";
import Link from "next/link";
import { AppRoutes } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import heroImage from "@/attached_assets/generated_images/hero_banner_with_streetwear_models.png";
import menCatImage from "@/attached_assets/generated_images/men's_fashion_category_image.png";
import womenCatImage from "@/attached_assets/generated_images/women's_fashion_category_image.png";
import accessCatImage from "@/attached_assets/generated_images/accessories_category_image.png";
import { ProductCard } from "@/components/ui/product-card";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/common/skeleton";
import Image from "next/image";

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.fetchProducts,
  });

  const featuredProducts = products.filter(p => p.bestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt="Streetwear Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 uppercase tracking-tighter">
              Define Your <br />Identity
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
              Curated streetwear for the modern generation. Minimalist aesthetics meets premium utility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-base uppercase tracking-widest font-bold rounded-none bg-white text-black hover:bg-neutral-200 border-2 border-white" asChild>
                <Link href={AppRoutes.MEN}>Shop Men</Link>
              </Button>
              <Button size="lg" className="h-14 px-8 text-base uppercase tracking-widest font-bold rounded-none bg-transparent text-white border-2 border-white hover:bg-white hover:text-black" asChild>
                <Link href={AppRoutes.WOMEN}>Shop Women</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px]">
          <Link href={AppRoutes.MEN} className="group relative overflow-hidden h-full md:col-span-1">
            <Image
              src={menCatImage}
              alt="Men's Collection"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-heading font-bold text-white uppercase mb-2">Men</h3>
              <span className="text-white flex items-center gap-2 text-sm uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link href={AppRoutes.WOMEN} className="group relative overflow-hidden h-full md:col-span-1">
            <Image
              src={womenCatImage}
              alt="Women's Collection"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-heading font-bold text-white uppercase mb-2">Women</h3>
              <span className="text-white flex items-center gap-2 text-sm uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link href={AppRoutes.ACCESSORIES} className="group relative overflow-hidden h-full md:col-span-1">
            <Image
              src={accessCatImage}
              alt="Accessories"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-heading font-bold text-white uppercase mb-2">Accessories</h3>
              <span className="text-white flex items-center gap-2 text-sm uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight">Trending Now</h2>
          <Link href={AppRoutes.SHOP} className="hidden md:block text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors">
            View All
          </Link>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Button variant="outline" className="w-full uppercase tracking-widest rounded-none h-12" asChild>
            <Link href={AppRoutes.SHOP}>View All Products</Link>
          </Button>
        </div>
      </section>

      {/* Banner Break */}
      <section className="bg-black text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-6">
            New Season Drop
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto mb-8 text-lg">
            Explore the latest additions to our collection. Limited quantities available for our exclusive seasonal release.
          </p>
          <Button className="bg-white text-black hover:bg-neutral-200 h-14 px-10 text-base uppercase tracking-widest font-bold rounded-none">
            Explore Collection
          </Button>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight">New Arrivals</h2>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

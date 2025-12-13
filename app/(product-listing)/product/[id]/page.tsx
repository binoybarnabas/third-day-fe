"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppRoutes, ToastVariant } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { Button } from "@/components/common/button";
import { Skeleton } from "@/components/common/skeleton";
import { Separator } from "@/components/common/separator";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/accordion";
import { Check, Heart, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RelatedProducts } from "@/components/ui/related-products";

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id ? parseInt(String(params.id)) : 0;

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.fetchProduct(productId),
    enabled: productId > 0,
  });

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-[3/4]" />)}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>

    );
  }

  if (!product) {
    return (
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold uppercase mb-4">Product Not Found</h1>
          <Button asChild variant="outline"><Link href={AppRoutes.HOME}>Return Home</Link></Button>
        </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: ToastVariant.DESTRUCTIVE,
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: ToastVariant.DESTRUCTIVE,
      });
      return;
    }

    addItem(product, selectedSize, selectedColor);
    toast({
      title: "Added to cart",
      description: `${product.title} - ${selectedColor} / ${selectedSize}`,
    });
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-muted-foreground" asChild>
          <Link href={AppRoutes.HOME} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Shopping
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-secondary overflow-hidden w-full">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-[3/4] bg-secondary overflow-hidden border-2 transition-colors ${currentImageIndex === idx ? "border-black" : "border-transparent hover:border-neutral-200"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col h-full">
            <div className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">
              {product.category} / {product.subCategory}
            </div>
            <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-4">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-medium">${parseFloat(product.price).toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${parseFloat(product.originalPrice).toFixed(2)}</span>
              )}
            </div>

            <Separator className="mb-8" />

            <div className="space-y-8">
              {/* Colors */}
              <div>
                <label className="text-sm font-bold uppercase tracking-wide mb-3 block">
                  Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                          h-10 px-4 border text-sm uppercase tracking-wide transition-all
                          ${selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-input hover:border-black bg-white text-black"}
                        `}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold uppercase tracking-wide block">
                    Size: <span className="font-normal text-muted-foreground">{selectedSize}</span>
                  </label>
                  <button className="text-xs underline uppercase tracking-wide text-muted-foreground hover:text-black">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                          h-12 flex items-center justify-center border text-sm transition-all
                          ${selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-input hover:border-black bg-white text-black"}
                        `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  size="lg"
                  className="w-full h-14 text-base uppercase tracking-widest font-bold rounded-none"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`w-full h-14 text-base uppercase tracking-widest font-bold rounded-none flex gap-2 transition-colors ${isInWishlist(product.id) ? "bg-black text-white hover:bg-black/90 hover:text-white" : ""
                    }`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Info Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger className="uppercase font-bold text-sm">Description</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger className="uppercase font-bold text-sm">Shipping & Returns</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <p className="mb-2">Free standard shipping on orders over $150.</p>
                    <p>Returns accepted within 30 days of delivery. Items must be unworn and in original packaging.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="details">
                  <AccordionTrigger className="uppercase font-bold text-sm">Product Details</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Premium heavyweight cotton</li>
                      <li>Relaxed fit</li>
                      <li>Machine wash cold</li>
                      <li>Made in Portugal</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <RelatedProducts currentProductId={product.id} category={product.category} />
        </div>
      </div>
  );
}


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import { Button } from "@/components/common/button";
import { Separator } from "@/components/common/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/accordion";
import { Heart, X } from "lucide-react";
import { useState } from "react";
import { ProductCategory, ProductSubCategory } from "@/types/enums";

interface ProductPreviewData {
  title: string;
  price: string;
  description: string;
  images: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  colors?: string[]; // Optional since it might not be in the form state yet
}

interface ProductPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProductPreviewData;
}

export function ProductPreviewModal({ isOpen, onClose, data }: ProductPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  if (!isOpen) return null;

  // Default mock colors if not provided (since the form currently doesn't have color selection in the provided snippet)
  const colors = data.colors && data.colors.length > 0 ? data.colors : ["Black", "White"];
  
  // Clean price display
  const formattedPrice = data.price ? parseFloat(data.price).toFixed(2) : "0.00";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] overflow-y-auto p-0 rounded-none md:rounded-lg">
        <DialogTitle className="sr-only">Product Preview</DialogTitle>
        <div className="relative p-6 md:p-10 bg-background">


          <div className="container mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-secondary overflow-hidden w-full rounded-md border">
                  {data.images.length > 0 ? (
                    <img
                      src={data.images[currentImageIndex] || data.images[0]}
                      alt={data.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                {data.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {data.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`aspect-[3/4] bg-secondary overflow-hidden border-2 transition-colors rounded-sm ${
                          currentImageIndex === idx ? "border-black" : "border-transparent hover:border-neutral-200"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col h-full pt-2">
                <div className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                  {data.category || "Category"} / {data.subCategory || "Sub-Category"}
                </div>
                <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-4">
                  {data.title || "Product Title"}
                </h1>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-2xl font-medium">${formattedPrice}</span>
                </div>

                <Separator className="mb-8" />

                <div className="space-y-8">
                  {/* Colors */}
                  <div>
                    <label className="text-sm font-bold uppercase tracking-wide mb-3 block">
                      Color: <span className="font-normal text-muted-foreground">{selectedColor || "Select a color"}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`
                              h-10 px-4 border text-sm uppercase tracking-wide transition-all
                              ${
                                selectedColor === color
                                  ? "border-black bg-black text-white"
                                  : "border-input hover:border-black bg-white text-black"
                              }
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
                        Size: <span className="font-normal text-muted-foreground">{selectedSize || "Select a size"}</span>
                      </label>
                      <span className="text-xs underline uppercase tracking-wide text-muted-foreground cursor-pointer">
                        Size Guide
                      </span>
                    </div>
                    {data.sizes.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {data.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`
                                h-12 flex items-center justify-center border text-sm transition-all
                                ${
                                  selectedSize === size
                                    ? "border-black bg-black text-white"
                                    : "border-input hover:border-black bg-white text-black"
                                }
                              `}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No sizes selected</div>
                    )}
                  </div>

                  {/* Actions (Visual Only) */}
                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      size="lg"
                      className="w-full h-14 text-base uppercase tracking-widest font-bold rounded-none cursor-not-allowed opacity-90"
                      onClick={(e) => e.preventDefault()}
                    >
                      Add to Cart (Preview)
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full h-14 text-base uppercase tracking-widest font-bold rounded-none flex gap-2 cursor-not-allowed"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="w-4 h-4" />
                      Add to Wishlist (Preview)
                    </Button>
                  </div>

                  {/* Info Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="description">
                      <AccordionTrigger className="uppercase font-bold text-sm">Description</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {data.description || "No description provided."}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="shipping">
                      <AccordionTrigger className="uppercase font-bold text-sm">Shipping & Returns</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        <p className="mb-2">Free standard shipping on orders over $150.</p>
                        <p>Returns accepted within 30 days of delivery. Items must be unworn and in original packaging.</p>
                        <p className="mt-2 text-xs italic text-muted-foreground">* Standard policy shown for preview</p>
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
                         <li className="list-none mt-2 text-xs italic text-muted-foreground">* Standard details shown for preview</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

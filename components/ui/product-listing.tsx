"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ProductCategory, AppRoutes, SortOption } from "@/types/enums";
import { ProductCard } from "@/components/ui/product-card";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/common/accordion";
import { Checkbox } from "@/components/common/checkbox";
import { Label } from "@/components/common/label";
import { Slider } from "@/components/common/slider";
import { Separator } from "@/components/common/separator";
import { Button } from "@/components/common/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/common/sheet";
import { Filter, ChevronDown, Loader2, ArrowUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import { Skeleton } from "@/components/common/skeleton";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ProductListingProps {
  category?: string;
}

export default function ProductListing({ category: propCategory }: ProductListingProps) {
  const location = usePathname();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(SortOption.NEWEST);
  
  const [visibleCount, setVisibleCount] = useState(8);
  const observerTarget = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.fetchProducts,
  });

  const category = propCategory || (location === AppRoutes.SHOP
    ? undefined
    : location.slice(1).charAt(0).toUpperCase() + location.slice(2));

  const allColors = Array.from(new Set(allProducts.flatMap(p => p.colors)));
  const allSizes = Array.from(new Set(allProducts.flatMap(p => p.sizes)));

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (category) {
      if (category === ProductCategory.ACCESSORIES) {
        result = result.filter(p => p.category === ProductCategory.ACCESSORIES);
      } else {
        result = result.filter(p => p.gender === category || p.category === category);
      }
    }

    result = result.filter(
      (p) => parseFloat(p.price) >= priceRange[0] && parseFloat(p.price) <= priceRange[1]
    );

    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }

    if (sortBy === SortOption.PRICE_ASC) {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === SortOption.PRICE_DESC) {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [allProducts, category, priceRange, selectedColors, selectedSizes, sortBy]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && visibleCount < filteredProducts.length) {
      setVisibleCount((prev) => prev + 4);
    }
  }, [filteredProducts.length, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    setVisibleCount(8);
  }, [category, priceRange, selectedColors, selectedSizes, sortBy]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-bold uppercase text-lg mb-4">Filters</h3>
        <Separator />
      </div>

      <Accordion type="multiple" defaultValue={["price", "color", "size"]} className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger className="uppercase font-bold text-sm hover:no-underline px-0">Price</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <Slider defaultValue={[0, 300]} max={500} step={1} value={priceRange} onValueChange={setPriceRange} className="mb-4" />
              <div className="flex justify-between text-sm font-medium">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="uppercase font-bold text-sm hover:no-underline px-0">Color</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {allColors.map(color => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox id={`color-${color}`} checked={selectedColors.includes(color)} onCheckedChange={() => toggleColor(color)} />
                  <Label htmlFor={`color-${color}`} className="text-sm">{color}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="uppercase font-bold text-sm hover:no-underline px-0">Size</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-2">
              {allSizes.map(size => (
                <div
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`cursor-pointer text-center py-2 text-sm border transition-colors ${selectedSizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-black border-neutral-200 hover:border-black"}`}
                >
                  {size}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">
            {category || "Shop All"}
          </h1>
          <p className="text-muted-foreground">{filteredProducts.length} Products</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex-1 gap-2 uppercase tracking-widest rounded-none">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <div className="sr-only">
                <SheetTitle>Filter Products</SheetTitle>
              </div>
              <FilterSidebar />
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 md:w-[200px] justify-between uppercase tracking-widest rounded-none">
                Sort By <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setSortBy(SortOption.NEWEST)}>Newest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy(SortOption.PRICE_ASC)}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy(SortOption.PRICE_DESC)}>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* FIXED STICKY SIDEBAR */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 self-start">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-hide">
            <FilterSidebar />
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.slice(0, visibleCount).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: (index % 3) * 0.1, ease: "easeOut" }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div ref={observerTarget} className="w-full flex justify-center py-12">
                {visibleCount < filteredProducts.length && (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-xs uppercase tracking-widest font-bold">Loading More</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <h3 className="text-xl font-bold uppercase mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
              <Button variant="link" className="mt-4" onClick={() => { setPriceRange([0, 500]); setSelectedColors([]); setSelectedSizes([]); }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="fixed bottom-8 right-8 z-50">
            <Button size="icon" onClick={scrollToTop} className="rounded-full shadow-2xl bg-black hover:bg-neutral-800 text-white w-12 h-12">
              <ArrowUp className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
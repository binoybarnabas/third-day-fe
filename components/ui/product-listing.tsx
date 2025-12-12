"use client";
import { useState, useMemo, useEffect } from "react";
import { ProductCategory, AppRoutes, SortOption } from "@/types/enums";
import { Layout } from "@/components/ui/layout";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/common/sheet";
import { Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import { Skeleton } from "@/components/common/skeleton";
import { usePathname } from "next/navigation";
import { PaginationControl } from "@/components/common/pagination-control";

// Assuming dummyProducts is defined elsewhere or will be provided.
// For now, let's keep the useQuery and adapt the filtering.
// If the user intended to replace useQuery with dummyProducts, that's a larger change.
// I will integrate the pagination and the new category logic,
// and adapt the provided filtering logic to use `allProducts` from `useQuery`.

// Dummy product data for demonstration if api.fetchProducts is not available or for testing
// const dummyProducts = [
//   { id: 1, name: "Classic Tee", price: "25.00", colors: ["Black", "White"], sizes: ["S", "M", "L"], gender: "Men", category: "T-Shirts" },
//   { id: 2, name: "Sport Shorts", price: "35.00", colors: ["Blue", "Black"], sizes: ["M", "L", "XL"], gender: "Men", category: "Shorts" },
//   { id: 3, name: "Elegant Dress", price: "80.00", colors: ["Red", "Black"], sizes: ["XS", "S", "M"], gender: "Women", category: "Dresses" },
//   { id: 4, name: "Running Shoes", price: "120.00", colors: ["White", "Green"], sizes: ["7", "8", "9"], gender: "Unisex", category: "Shoes" },
//   { id: 5, name: "Leather Wallet", price: "50.00", colors: ["Black", "Brown"], sizes: [], gender: "Unisex", category: "Accessories" },
//   { id: 6, name: "Denim Jacket", price: "90.00", colors: ["Blue"], sizes: ["S", "M", "L"], gender: "Men", category: "Jackets" },
//   { id: 7, name: "Yoga Pants", price: "45.00", colors: ["Black", "Grey"], sizes: ["XS", "S", "M"], gender: "Women", category: "Pants" },
//   { id: 8, name: "Baseball Cap", price: "20.00", colors: ["Black", "White"], sizes: [], gender: "Unisex", category: "Accessories" },
//   { id: 9, name: "Graphic Hoodie", price: "60.00", colors: ["Grey", "Black"], sizes: ["M", "L", "XL"], gender: "Unisex", category: "Hoodies" },
//   { id: 10, name: "Summer Skirt", price: "40.00", colors: ["Yellow", "White"], sizes: ["S", "M"], gender: "Women", category: "Skirts" },
//   { id: 11, name: "Winter Coat", price: "150.00", colors: ["Black", "Navy"], sizes: ["S", "M", "L", "XL"], gender: "Unisex", category: "Jackets" },
//   { id: 12, name: "Swim Trunks", price: "30.00", colors: ["Blue", "Red"], sizes: ["M", "L"], gender: "Men", category: "Swimwear" },
//   { id: 13, name: "Sunglasses", price: "75.00", colors: ["Black", "Brown"], sizes: [], gender: "Unisex", category: "Accessories" },
//   { id: 14, name: "Blouse", price: "55.00", colors: ["White", "Pink"], sizes: ["XS", "S", "M"], gender: "Women", category: "Shirts" },
//   { id: 15, name: "Cargo Pants", price: "65.00", colors: ["Green", "Khaki"], sizes: ["M", "L", "XL"], gender: "Men", category: "Pants" },
//   { id: 16, name: "Beanie", price: "18.00", colors: ["Black", "Grey"], sizes: [], gender: "Unisex", category: "Accessories" },
//   { id: 17, name: "Polo Shirt", price: "40.00", colors: ["Blue", "White"], sizes: ["S", "M", "L"], gender: "Men", category: "Shirts" },
//   { id: 18, name: "Maxi Dress", price: "95.00", colors: ["Floral", "Blue"], sizes: ["S", "M", "L"], gender: "Women", category: "Dresses" },
//   { id: 19, name: "Backpack", price: "70.00", colors: ["Black", "Navy"], sizes: [], gender: "Unisex", category: "Accessories" },
//   { id: 20, name: "Track Jacket", price: "85.00", colors: ["Red", "Black"], sizes: ["M", "L", "XL"], gender: "Unisex", category: "Jackets" },
// ];


interface ProductListingProps {
  category?: string;
}

export default function ProductListing({ category: propCategory }: ProductListingProps) {
  const location = usePathname();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(SortOption.NEWEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.fetchProducts,
  });

  // Extract category from props or URL path
  const category = propCategory || (location === AppRoutes.SHOP
    ? undefined
    : location.slice(1).charAt(0).toUpperCase() + location.slice(2));

  const allColors = Array.from(new Set(allProducts.flatMap(p => p.colors)));
  const allSizes = Array.from(new Set(allProducts.flatMap(p => p.sizes)));

  const filteredProducts = useMemo(() => {
    let result = allProducts; // Use allProducts from useQuery

    // Filter by Category
    if (category) {
      if (category === ProductCategory.ACCESSORIES) {
        result = result.filter(p => p.category === ProductCategory.ACCESSORIES);
      } else {
        result = result.filter(p => p.gender === category || p.category === category);
      }
    }

    // Filter by Price
    result = result.filter(
      (p) => parseFloat(p.price) >= priceRange[0] && parseFloat(p.price) <= priceRange[1]
    );

    // Filter by Color
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    // Filter by Size
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Sort
    if (sortBy === SortOption.PRICE_ASC) {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === SortOption.PRICE_DESC) {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
      // Newest
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [allProducts, category, priceRange, selectedColors, selectedSizes, sortBy]);

  // Pagination Logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, priceRange, selectedColors, selectedSizes, sortBy, itemsPerPage]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-bold uppercase text-lg mb-4">Filters</h3>
        <Separator />
      </div>

      <Accordion type="multiple" defaultValue={["price", "color", "size"]} className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger className="uppercase font-bold text-sm">Price</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <Slider
                defaultValue={[0, 300]}
                max={500}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm font-medium">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="uppercase font-bold text-sm">Color</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {allColors.map(color => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={() => toggleColor(color)}
                  />
                  <Label htmlFor={`color-${color}`} className="text-sm">{color}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="uppercase font-bold text-sm">Size</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-2">
              {allSizes.map(size => (
                <div
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`
                    cursor-pointer text-center py-2 text-sm border transition-colors
                    ${selectedSizes.includes(size)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-neutral-200 hover:border-black"}
                  `}
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">
              {category || "Shop All"}
            </h1>
            <p className="text-muted-foreground">{totalItems} Products</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden flex-1 gap-2 uppercase tracking-widest rounded-none">
                  <Filter className="w-4 h-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
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

        <div className="flex flex-col md:flex-row gap-12">
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  totalItems={totalItems}
                />
              </>
            ) : (
              <div className="text-center py-24">
                <h3 className="text-xl font-bold uppercase mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters.</p>
                <Button
                  variant="link"
                  className="mt-4"
                  onClick={() => {
                    setPriceRange([0, 500]);
                    setSelectedColors([]);
                    setSelectedSizes([]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// import { useState, useMemo } from "react";
// import { Layout } from "@/components/layout";
// import { ProductCard } from "@/components/product-card";
// import { useQuery } from "@tanstack/react-query";
// import * as api from "@/lib/api";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger
// } from "@/components/ui/accordion";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Filter, ChevronDown } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Skeleton } from "@/components/ui/skeleton";

// interface ProductListingProps {
//   category?: string;
// }

// export default function ProductListing({ category }: ProductListingProps) {
//   const [priceRange, setPriceRange] = useState([0, 300]);
//   const [selectedColors, setSelectedColors] = useState<string[]>([]);
//   const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
//   const [sortBy, setSortBy] = useState("newest");

//   const { data: allProducts = [], isLoading } = useQuery({
//     queryKey: ['products'],
//     queryFn: api.fetchProducts,
//   });

//   const allColors = Array.from(new Set(allProducts.flatMap(p => p.colors)));
//   const allSizes = Array.from(new Set(allProducts.flatMap(p => p.sizes)));

//   const filteredProducts = useMemo(() => {
//     return allProducts.filter(product => {
//       if (category && category !== "Shop" && product.gender !== category && product.category !== category) {
//         if (category === "Accessories" && product.category !== "Accessories") return false;
//         if ((category === "Men" || category === "Women") && product.gender !== category) return false;
//       }

//       const price = parseFloat(product.price);
//       if (price < priceRange[0] || price > priceRange[1]) return false;

//       if (selectedColors.length > 0) {
//         const hasColor = product.colors.some(c => selectedColors.includes(c));
//         if (!hasColor) return false;
//       }

//       if (selectedSizes.length > 0) {
//         const hasSize = product.sizes.some(s => selectedSizes.includes(s));
//         if (!hasSize) return false;
//       }

//       return true;
//     }).sort((a, b) => {
//       if (sortBy === "price-asc") return parseFloat(a.price) - parseFloat(b.price);
//       if (sortBy === "price-desc") return parseFloat(b.price) - parseFloat(a.price);
//       return 0;
//     });
//   }, [allProducts, category, priceRange, selectedColors, selectedSizes, sortBy]);

//   const toggleColor = (color: string) => {
//     setSelectedColors(prev =>
//       prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
//     );
//   };

//   const toggleSize = (size: string) => {
//     setSelectedSizes(prev =>
//       prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
//     );
//   };

//   const FilterSidebar = () => (
//     <div className="space-y-6">
//       <div>
//         <h3 className="font-heading font-bold uppercase text-lg mb-4">Filters</h3>
//         <Separator />
//       </div>

//       <Accordion type="multiple" defaultValue={["price", "color", "size"]} className="w-full">
//         <AccordionItem value="price">
//           <AccordionTrigger className="uppercase font-bold text-sm">Price</AccordionTrigger>
//           <AccordionContent>
//             <div className="px-2 py-4">
//               <Slider
//                 defaultValue={[0, 300]}
//                 max={500}
//                 step={10}
//                 value={priceRange}
//                 onValueChange={setPriceRange}
//                 className="mb-4"
//               />
//               <div className="flex justify-between text-sm font-medium">
//                 <span>${priceRange[0]}</span>
//                 <span>${priceRange[1]}</span>
//               </div>
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="color">
//           <AccordionTrigger className="uppercase font-bold text-sm">Color</AccordionTrigger>
//           <AccordionContent>
//             <div className="space-y-2">
//               {allColors.map(color => (
//                 <div key={color} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`color-${color}`}
//                     checked={selectedColors.includes(color)}
//                     onCheckedChange={() => toggleColor(color)}
//                   />
//                   <Label htmlFor={`color-${color}`} className="text-sm">{color}</Label>
//                 </div>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="size">
//           <AccordionTrigger className="uppercase font-bold text-sm">Size</AccordionTrigger>
//           <AccordionContent>
//             <div className="grid grid-cols-4 gap-2">
//               {allSizes.map(size => (
//                 <div
//                   key={size}
//                   onClick={() => toggleSize(size)}
//                   className={`
//                     cursor-pointer text-center py-2 text-sm border transition-colors
//                     ${selectedSizes.includes(size)
//                       ? "bg-black text-white border-black"
//                       : "bg-white text-black border-neutral-200 hover:border-black"}
//                   `}
//                 >
//                   {size}
//                 </div>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   );

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">
//               {category || "Shop All"}
//             </h1>
//             <p className="text-muted-foreground">{filteredProducts.length} Products</p>
//           </div>

//           <div className="flex items-center gap-4 w-full md:w-auto">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="outline" className="md:hidden flex-1 gap-2 uppercase tracking-widest rounded-none">
//                   <Filter className="w-4 h-4" /> Filters
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="w-[300px] overflow-y-auto">
//                 <FilterSidebar />
//               </SheetContent>
//             </Sheet>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="flex-1 md:w-[200px] justify-between uppercase tracking-widest rounded-none">
//                   Sort By <ChevronDown className="w-4 h-4 opacity-50" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-[200px]">
//                 <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setSortBy("price-asc")}>Price: Low to High</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setSortBy("price-desc")}>Price: High to Low</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row gap-12">
//           <div className="hidden md:block w-64 flex-shrink-0">
//             <FilterSidebar />
//           </div>

//           <div className="flex-1">
//             {isLoading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
//                 {[1, 2, 3, 4, 5, 6].map((i) => (
//                   <div key={i} className="space-y-4">
//                     <Skeleton className="aspect-[3/4] w-full" />
//                     <Skeleton className="h-4 w-3/4" />
//                     <Skeleton className="h-4 w-1/2" />
//                   </div>
//                 ))}
//               </div>
//             ) : filteredProducts.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
//                 {filteredProducts.map(product => (
//                   <ProductCard key={product.id} product={product} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-24">
//                 <h3 className="text-xl font-bold uppercase mb-2">No products found</h3>
//                 <p className="text-muted-foreground">Try adjusting your filters.</p>
//                 <Button
//                   variant="link"
//                   className="mt-4"
//                   onClick={() => {
//                     setPriceRange([0, 500]);
//                     setSelectedColors([]);
//                     setSelectedSizes([]);
//                   }}
//                 >
//                   Clear all filters
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

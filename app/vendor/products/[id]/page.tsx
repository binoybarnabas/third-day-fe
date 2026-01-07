"use client";
import { useState, useEffect, useRef } from "react";
import { VendorLayout } from "@/components/ui/vendor-layout";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/card";
import { Separator } from "@/components/common/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Checkbox } from "@/components/common/checkbox";
import { toast } from "sonner";
import * as api from "@/lib/api";
import {
  ProductCategory,
  ProductSubCategory,
  ProductGender,
  ProductSize
} from "@/types/enums";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Upload, Loader2, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProductPreviewModal } from "@/components/vendor/product-preview-modal";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  
  // Unwrapping params safely
  const [unwrappedParams, setUnwrappedParams] = useState<{id: string} | null>(null);

  useEffect(() => {
    params.then(p => setUnwrappedParams(p));
  }, [params]);

  const productId = unwrappedParams ? parseInt(unwrappedParams.id) : null;
  
  // State for form
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [stock, setStock] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Image State
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  
  // Refs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  
  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productId ? api.fetchVendorProduct(productId) : Promise.resolve(null),
    enabled: !!productId,
  });

  // Populate form when data loads
  useEffect(() => {
     if (product && !isDataLoaded) {
        setTitle(product.title);
        setPrice(product.price);
        setDescription(product.description || "");
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setGender(product.gender);
        setStock(product.stock.toString());
        setSelectedSizes(product.sizes || []);
        
        // Split images
        if (product.images && product.images.length > 0) {
            setThumbnail(product.images[0]);
            setGallery(product.images.slice(1));
        }
        
        setIsDataLoaded(true);
     }
  }, [product, isDataLoaded]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
           setThumbnail(reader.result as string);
        };
        reader.readAsDataURL(file);
     }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGallery(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeThumbnail = () => setThumbnail(null);

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !productId) return;
    
    setIsSubmitting(true);
    try {
      const allImages = thumbnail ? [thumbnail, ...gallery] : gallery;
      
      const updatedProduct: api.Product = {
        ...product,
        title,
        price,
        description,
        category: category as ProductCategory,
        subCategory: subCategory as ProductSubCategory,
        gender: gender as ProductGender,
        images: allImages,
        sizes: selectedSizes as ProductSize[],
        stock: parseInt(stock) || 0,
      };

      await api.updateVendorProduct(updatedProduct);
      toast.success("Product updated successfully!");
      router.push("/vendor/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!unwrappedParams || isLoading) {
      return (
          <VendorLayout>
              <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
          </VendorLayout>
      )
  }

  return (
    <VendorLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/vendor/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground text-sm">Update product details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
              <CardTitle>Classification & Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Selects */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(ProductCategory).map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Other selects could go here similarly... */}
                     <div className="space-y-2">
                      <Label>Sub-Category</Label>
                      <Select value={subCategory} onValueChange={setSubCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(ProductSubCategory).map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(ProductGender).map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label>Available Sizes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.values(ProductSize).map((size) => (
                        <div key={size} className="flex items-center space-x-2 border p-2 rounded hover:bg-muted cursor-pointer" onClick={() => handleSizeToggle(size)}>
                          <Checkbox 
                            id={`size-${size}`} 
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => handleSizeToggle(size)}
                          />
                          <label className="text-sm font-medium cursor-pointer">{size}</label>
                        </div>
                      ))}
                    </div>
                  </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
               <CardDescription>
                Manage your product's visual presentation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thumbnail Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Thumbnail (Front View)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] bg-secondary/20 relative transition-colors hover:bg-secondary/30">
                  {thumbnail ? (
                    <div className="relative w-full h-full aspect-[3/4] max-h-[300px]">
                      <img 
                        src={thumbnail} 
                        alt="Thumbnail" 
                        className="w-full h-full object-contain rounded-md" 
                      />
                      <button 
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Main Image
                      </div>
                    </div>
                  ) : (
                     <div className="text-center space-y-4 w-full">
                       <div className="flex flex-col items-center justify-center">
                          <Upload className="h-10 w-10 opacity-50 mb-2" />
                          <p className="text-sm font-medium text-muted-foreground">No thumbnail selected</p>
                       </div>
                       <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="w-full"
                       >
                          Select Thumbnail
                       </Button>
                       <input 
                          ref={thumbnailInputRef}
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleThumbnailUpload} 
                       />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Gallery Section */}
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <Label className="text-base font-semibold">Gallery Images</Label>
                   <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => galleryInputRef.current?.click()}
                   >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Images
                   </Button>
                   <input 
                      ref={galleryInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleGalleryUpload} 
                   />
                </div>
                 <div className="grid grid-cols-3 gap-2">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-md overflow-hidden bg-secondary border">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                   {gallery.length === 0 && (
                     <div className="col-span-3 py-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                        No additional images
                     </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-24"></div>

      {/* Fixed Actions Footer */}
      <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-background border-t p-4 px-6 md:px-8 z-50 flex items-center justify-end gap-4 shadow-top">
         <Button 
            className="h-12 w-full md:w-auto min-w-[150px]" 
            variant="outline"
            size="lg" 
            onClick={() => setShowPreview(true)}
            type="button"
         >
            <Eye className="mr-2 h-4 w-4" /> Preview
         </Button>
         <Button 
            className="h-12 w-full md:w-auto min-w-[200px]" 
            size="lg" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
         >
            {isSubmitting ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            ) : "Save Changes"}
         </Button>
      </div>

      <ProductPreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)}
        data={{
           title,
           price,
           description,
           images: (thumbnail ? [thumbnail, ...gallery] : gallery) as string[],
           category,
           subCategory,
           sizes: selectedSizes,
           colors: ["Black", "White"]
        }}
      />
    </VendorLayout>
  );
}

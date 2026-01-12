"use client";
import { useState, useRef } from "react";
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
import * as api from "@/lib/api";
import {
  ProductCategory,
  ProductSubCategory,
  ProductGender,
  ProductSize
} from "@/types/enums";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Upload, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/common/checkbox";
import { toast } from "sonner";
import { ProductPreviewModal } from "@/components/vendor/product-preview-modal";
import { AdminLayout } from "@/components/ui/admin-layout";

export default function VendorAddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Form State
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

  // ... (handleSizeToggle remains same)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category || !subCategory || !gender || !thumbnail) {
      toast.error("Please fill in all required fields and upload a thumbnail.");
      return;
    }

    setIsLoading(true);

    try {
      const allImages = [thumbnail, ...gallery];
      const newProduct: api.Product = {
        id: Date.now(), // Mock ID
        title,
        price,
        description,
        category: category as ProductCategory,
        subCategory: subCategory as ProductSubCategory,
        gender: gender as ProductGender,
        images: allImages,
        sizes: selectedSizes as ProductSize[],
        colors: ["Black", "White"], // Default or add color picker
        stock: parseInt(stock) || 0,
        newArrival: true,
        bestSeller: false,
      };

      await api.addVendorProduct(newProduct);
      toast.success("Product added successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground text-sm">Create a new listing for your store</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Product Details</CardTitle>
              <CardDescription>Basic information about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Oversized Graphic T-Shirt" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="0" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter a detailed description about features, material, and fit..." 
                  className="min-h-[160px] resize-y p-4 leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category <span className="text-red-500">*</span></Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductCategory).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label>Sub-Category <span className="text-red-500">*</span></Label>
                   <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductSubCategory).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label>Gender <span className="text-red-500">*</span></Label>
                   <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductGender).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Available Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(ProductSize).map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <div 
                        key={size} 
                        onClick={() => handleSizeToggle(size)}
                        className={`
                          cursor-pointer px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200
                          ${isSelected 
                            ? "bg-black text-white border-black shadow-sm" 
                            : "bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black"
                          }
                        `}
                      >
                        {size}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar for Media & Actions */}
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
              <div className="space-y-4">
                <Label className="text-base font-semibold">Thumbnail (Front View) <span className="text-red-500">*</span></Label>
                <div 
                  className={`
                    border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[260px] relative transition-all duration-200
                    ${thumbnail ? "border-neutral-200 bg-white" : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100/50 hover:border-neutral-400"}
                  `}
                >
                  {thumbnail ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative w-full max-w-[200px] aspect-[3/4] shadow-lg rounded-lg overflow-hidden">
                        <img 
                          src={thumbnail} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute -top-2 -right-2 bg-white text-destructive border shadow-sm rounded-full p-2 hover:bg-destructive hover:text-white transition-colors z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                        Main Image
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 w-full max-w-xs mx-auto">
                       <div className="w-16 h-16 bg-white rounded-full shadow-sm border flex items-center justify-center mx-auto mb-2">
                          <Upload className="h-8 w-8 text-neutral-400" />
                       </div>
                       <div className="space-y-1">
                          <h3 className="font-semibold text-neutral-900">Upload Thumbnail</h3>
                          <p className="text-sm text-muted-foreground">Click to browse or drag & drop</p>
                       </div>
                       <Button 
                          type="button" 
                          variant="default" // Changed to default black button
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="w-full mt-2"
                       >
                          Select Image
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
            disabled={isLoading}
         >
            {isLoading ? (
               <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
               </>
            ) : "Publish Product"}
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
           colors: ["Black", "White"] // Static for now as it's not in form
        }}
      />
    </AdminLayout>
  );
}

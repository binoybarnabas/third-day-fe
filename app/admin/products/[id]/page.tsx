"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/ui/admin-layout";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/common/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/common/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/common/select";
import { Product, fetchProducts, addProduct, updateProduct, deleteProduct } from "@/lib/api";
import { ProductCategory, ProductGender, ToastVariant, ProductSubCategory, ProductSize } from "@/types/enums";
import { Plus, Trash2, Search, Edit, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "@/components/common/pagination-control";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/common/checkbox";

export default function ProductManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const queryClient = useQueryClient();

    // Fetch Products
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        title: "",
        price: "",
        category: ProductCategory.HOODIES,
        gender: ProductGender.MEN,
        description: "",
        images: [],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black"],
        stock: 10,
    });
    const [imageUrlInput, setImageUrlInput] = useState("");

    // Reset form when sheet closes or mode changes
    useEffect(() => {
        if (!isSheetOpen) {
            setEditingProduct(null);
            setFormData({
                title: "",
                price: "",
                category: ProductCategory.HOODIES,
                gender: ProductGender.MEN,
                description: "",
                images: [],
                sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
                colors: ["Black"],
                stock: 10,
            });
        }
    }, [isSheetOpen]);

    // Populate form when editing
    useEffect(() => {
        if (editingProduct) {
            setFormData(editingProduct);
        }
    }, [editingProduct]);

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    // Mutations
    const addMutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({ title: "Product added successfully" });
            setIsSheetOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({ title: "Product updated successfully" });
            setIsSheetOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({ title: "Product deleted" });
        },
    });

    const handleSave = () => {
        if (!formData.title || !formData.price) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: ToastVariant.DESTRUCTIVE,
            });
            return;
        }

        const productData = {
            ...formData,
            price: formData.price?.toString() || "0",
            stock: Number(formData.stock) || 0,
            newArrival: true,
            bestSeller: false,
            subCategory: ProductSubCategory.STREETWEAR, // Default
        } as Product;

        if (editingProduct) {
            updateMutation.mutate(productData);
        } else {
            addMutation.mutate({
                ...productData,
                id: Math.max(...products.map(p => p.id), 0) + 1,
            });
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsSheetOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), reader.result as string]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImageUrl = () => {
        if (imageUrlInput) {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), imageUrlInput]
            }));
            setImageUrlInput("");
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">
                            Product Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your store inventory ({products.length} products)
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button className="uppercase tracking-widest font-bold rounded-none gap-2">
                                    <Plus className="w-4 h-4" /> Add Product
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                                <SheetHeader>
                                    <SheetTitle>{editingProduct ? "Edit Product" : "Add New Product"}</SheetTitle>
                                    <SheetDescription>
                                        {editingProduct ? "Update product details." : "Add a new product to your inventory."}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e: any) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Price ($)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={(e: any) =>
                                                    setFormData({ ...formData, price: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={formData.stock}
                                                onChange={(e: any) =>
                                                    setFormData({
                                                        ...formData,
                                                        stock: parseInt(e.target.value),
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value: any) =>
                                                setFormData({ ...formData, category: value as ProductCategory })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ProductCategory.HOODIES}>Hoodies</SelectItem>
                                                <SelectItem value={ProductCategory.T_SHIRTS}>T-Shirts</SelectItem>
                                                <SelectItem value={ProductCategory.PANTS}>Pants</SelectItem>
                                                <SelectItem value={ProductCategory.TOPS}>Tops</SelectItem>
                                                <SelectItem value={ProductCategory.ACCESSORIES}>Accessories</SelectItem>
                                            </SelectContent >
                                        </Select >
                                    </div >
                                    <div className="grid gap-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(value: any) =>
                                                setFormData({ ...formData, gender: value as any })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ProductGender.MEN}>Men</SelectItem>
                                                <SelectItem value={ProductGender.WOMEN}>Women</SelectItem>
                                                <SelectItem value={ProductGender.UNISEX}>Unisex</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Product Images</Label>

                                        {/* File Upload */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="image-upload" className="text-xs text-muted-foreground">Upload Image</Label>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        {/* URL Input */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="image-url" className="text-xs text-muted-foreground">Or Add Image URL</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="image-url"
                                                    placeholder="https://..."
                                                    value={imageUrlInput}
                                                    onChange={(e: any) => setImageUrlInput(e.target.value)}
                                                />
                                                <Button type="button" variant="outline" onClick={handleAddImageUrl}>
                                                    Add
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Image Preview List */}
                                        {formData.images && formData.images.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                {formData.images.map((img, index) => (
                                                    <div key={index} className="relative group aspect-square rounded-md overflow-hidden border">
                                                        <img
                                                            src={img}
                                                            alt={`Product ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div >
                                <SheetFooter>
                                    <Button type="submit" onClick={handleSave} disabled={addMutation.isPending || updateMutation.isPending}>
                                        {addMutation.isPending || updateMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : null}
                                        {editingProduct ? "Update Product" : "Save Product"}
                                    </Button>
                                </SheetFooter>
                            </SheetContent >
                        </Sheet >
                    </div >
                </div >

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="h-12 w-12 object-cover rounded-sm"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>{product.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {product.gender}
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                            onClick={() => deleteMutation.mutate(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    totalItems={totalItems}
                />
            </div >
        </AdminLayout >
    );
}

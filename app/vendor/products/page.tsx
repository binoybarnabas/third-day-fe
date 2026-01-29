"use client";
import { useState } from "react";
import { VendorLayout } from "@/components/ui/vendor-layout";
import { Button } from "@/components/common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { Product } from "@/lib/api";
import { Plus, Loader2, Edit3 } from "lucide-react";
import Link from "next/link";
import { AppRoutes, ProductStatus } from "@/types/enums";
import { PaginationControl } from "@/components/common/pagination-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { toast } from "sonner";

export default function VendorProductsPage() {
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.fetchVendorProducts(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { product: Product, newStatus: ProductStatus }) => {
      return api.updateProduct({ ...data.product, status: data.newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatusChange = (product: Product, newStatus: ProductStatus) => {
     updateStatusMutation.mutate({ product, newStatus });
  };

  return (
    <VendorLayout>
      {/* Responsive Header: Stacks on mobile, side-by-side on tablet+ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-tight">My Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/vendor/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card className="border-none sm:border shadow-none sm:shadow-sm bg-transparent sm:bg-card">
        <CardHeader className="px-0 sm:px-6">
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-card">
              <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
              <Button asChild variant="outline">
                <Link href="/vendor/products/add">Add your first product</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* DESKTOP TABLE: Hidden on mobile (md breakpoint) */}
              <div className="hidden md:block rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground w-[100px]">Image</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Title</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Category</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Price</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Stock</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentProducts.map((product) => (
                      <tr key={product.id} className="transition-colors hover:bg-muted/50">
                        <td className="p-4">
                          <div className="h-12 w-12 rounded bg-secondary overflow-hidden">
                             <img 
                              src={product.images[0] || "/placeholder.png"} 
                              alt={product.title}
                              className="h-full w-full object-cover"
                             />
                          </div>
                        </td>
                        <td className="p-4 font-medium">{product.title}</td>
                        <td className="p-4 text-muted-foreground">{product.category} / {product.subCategory}</td>
                        <td className="p-4 font-medium">${product.price}</td>
                        <td className="p-4">{product.stock}</td>
                        <td className="p-4">
                          <Select 
                            defaultValue={product.status || ProductStatus.ACTIVE} 
                            onValueChange={(val) => handleStatusChange(product, val as ProductStatus)}
                          >
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ProductStatus.ACTIVE}>Active</SelectItem>
                              <SelectItem value={ProductStatus.DRAFT}>Draft</SelectItem>
                              <SelectItem value={ProductStatus.ARCHIVED}>Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/vendor/products/${product.id}`}>Edit</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS: Hidden on desktop (md breakpoint) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {currentProducts.map((product) => (
                  <div key={product.id} className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-lg bg-secondary overflow-hidden shrink-0">
                        <img 
                          src={product.images[0] || "/placeholder.png"} 
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{product.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-sm">${product.price}</span>
                          <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <div className="flex-1">
                        <Select 
                          defaultValue={product.status || ProductStatus.ACTIVE} 
                          onValueChange={(val) => handleStatusChange(product, val as ProductStatus)}
                        >
                          <SelectTrigger className="w-full h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ProductStatus.ACTIVE}>Active</SelectItem>
                            <SelectItem value={ProductStatus.DRAFT}>Draft</SelectItem>
                            <SelectItem value={ProductStatus.ARCHIVED}>Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button asChild variant="outline" className="flex-1 h-9 text-xs gap-2">
                        <Link href={`/vendor/products/${product.id}`}>
                          <Edit3 className="w-3 h-3" /> Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <PaginationControl 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  totalItems={products.length}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </VendorLayout>
  );
}
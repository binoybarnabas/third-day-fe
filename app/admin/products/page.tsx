"use client";
import { useState } from "react";
import { Button } from "@/components/common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { Product } from "@/lib/api";
import { Plus, Loader2, MoreVertical, Edit2 } from "lucide-react";
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
import { AdminLayout } from "@/components/ui/admin-layout";

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
    <AdminLayout>
      {/* Header section: Stack vertically on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold uppercase tracking-tight">My Products</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Manage your product catalog</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card className="border-none sm:border shadow-none sm:shadow-sm">
        <CardHeader className="px-0 sm:px-6">
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
              <Button asChild variant="outline">
                <Link href="/admin/products/add">Add your first product</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View: Hidden on small screens */}
              <div className="hidden md:block rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground w-[80px]">Image</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Title</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Category</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Price</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Stock</th>
                      <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="h-10 w-10 rounded bg-secondary overflow-hidden">
                             <img 
                              src={product.images[0] || "/placeholder.png"} 
                              alt={product.title}
                              className="h-full w-full object-cover"
                             />
                          </div>
                        </td>
                        <td className="p-4 font-medium">{product.title}</td>
                        <td className="p-4 text-muted-foreground">{product.category}</td>
                        <td className="p-4 font-medium">${product.price}</td>
                        <td className="p-4">{product.stock}</td>
                        <td className="p-4">
                          <Select 
                            defaultValue={product.status || ProductStatus.ACTIVE} 
                            onValueChange={(val) => handleStatusChange(product, val as ProductStatus)}
                          >
                            <SelectTrigger className="w-[110px] h-8 text-xs">
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
                            <Link href={`/admin/products/${product.id}`}>Edit</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile List View: Visible only on small screens */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {currentProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-md bg-secondary overflow-hidden shrink-0">
                        <img 
                          src={product.images[0] || "/placeholder.png"} 
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate text-sm">{product.title}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <p className="text-sm font-bold mt-1">${product.price}</p>
                      </div>
                      <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                        <Link href={`/admin/products/${product.id}`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Stock</span>
                        <span className="font-medium">{product.stock} units</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-muted-foreground">Status</span>
                        <Select 
                            defaultValue={product.status || ProductStatus.ACTIVE} 
                            onValueChange={(val) => handleStatusChange(product, val as ProductStatus)}
                          >
                            <SelectTrigger className="w-[100px] h-7 text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ProductStatus.ACTIVE}>Active</SelectItem>
                              <SelectItem value={ProductStatus.DRAFT}>Draft</SelectItem>
                              <SelectItem value={ProductStatus.ARCHIVED}>Archived</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
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
    </AdminLayout>
  );
}
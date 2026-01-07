"use client";
import { useState } from "react";
import { VendorLayout } from "@/components/ui/vendor-layout";
import { Button } from "@/components/common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { Product } from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { AppRoutes, ProductStatus } from "@/types/enums";
import { Badge } from "@/components/common/badge";
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tight">My Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/vendor/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
              <Button asChild variant="outline">
                <Link href="/vendor/products/add">Add your first product</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Image</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {currentProducts.map((product) => (
                      <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle">
                          <div className="h-12 w-12 rounded bg-secondary overflow-hidden">
                             <img 
                              src={product.images[0] || "/placeholder.png"} 
                              alt={product.title}
                              className="h-full w-full object-cover"
                             />
                          </div>
                        </td>
                        <td className="p-4 align-middle font-medium">{product.title}</td>
                        <td className="p-4 align-middle">{product.category} / {product.subCategory}</td>
                        <td className="p-4 align-middle font-medium">${product.price}</td>
                        <td className="p-4 align-middle">{product.stock}</td>
                        <td className="p-4 align-middle">
                          <Select 
                            defaultValue={product.status || ProductStatus.ACTIVE} 
                            onValueChange={(val) => handleStatusChange(product, val as ProductStatus)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ProductStatus.ACTIVE}>Active</SelectItem>
                              <SelectItem value={ProductStatus.DRAFT}>Draft</SelectItem>
                              <SelectItem value={ProductStatus.ARCHIVED}>Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/vendor/products/${product.id}`}>Edit</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
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

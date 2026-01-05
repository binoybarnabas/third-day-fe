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
} from "@/components/common/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/common/select";
import { Order } from "@/types/dto";
import { OrderStatus, ToastVariant } from "@/types/enums";
import { Search, Eye, Loader2, Calendar, Mail, Phone, MapPin, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "@/components/common/pagination-control";
import { Badge } from "@/components/common/badge";
import { Separator } from "@/components/common/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/lib/api";
import * as api from "@/lib/api";

export default function OrderManagement() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => api.fetchOrders(),
});

    const orders = Array.isArray(ordersData) ? ordersData : [];

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        setIsUpdating(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            
            if (selectedOrder) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }

            toast({
                title: "Order Updated",
                description: `Order #${orderId} status changed to ${newStatus}.`,
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.response?.data?.message || "Could not update status",
                variant: ToastVariant.DESTRUCTIVE
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // Filtering & Pagination
    const filteredOrders = orders.filter((order) =>
        order.id.toString().includes(searchQuery) ||
        order.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.DELIVERED: return 'bg-green-500 hover:bg-green-600';
            case OrderStatus.SHIPPED: return 'bg-blue-500 hover:bg-blue-600';
            case OrderStatus.PROCESSING: return 'bg-yellow-500 hover:bg-yellow-600';
            case OrderStatus.CANCELLED: return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">
                            Order Management
                        </h1>
                        <p className="text-muted-foreground">Manage and track system orders</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e: any) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border rounded-md bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono font-bold text-primary">#{order.id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.firstName} {order.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{order.email}</div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-bold">${order.total}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Sheet onOpenChange={(open) => !open && setSelectedOrder(null)}>
                                                <SheetTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="w-4 h-4 mr-2" /> Details
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                                                    <SheetHeader className="border-b pb-4">
                                                        <SheetTitle className="text-2xl">Order #{selectedOrder?.id}</SheetTitle>
                                                        <SheetDescription>View and update order details.</SheetDescription>
                                                    </SheetHeader>

                                                    {selectedOrder && (
                                                        <div className="py-6 space-y-6">
                                                            <div className="space-y-2 p-4 bg-secondary/20 rounded-lg border">
                                                                <Label className="text-xs uppercase font-bold text-muted-foreground">Order Status</Label>
                                                                <Select
                                                                    disabled={isUpdating}
                                                                    value={selectedOrder.status}
                                                                    onValueChange={(val: OrderStatus) => handleStatusChange(selectedOrder.id, val)}
                                                                >
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                                                                        <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                                                                        <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                                                                        <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                                                                        <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                {isUpdating && <p className="text-[10px] animate-pulse text-primary italic">Updating...</p>}
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-6 text-sm">
                                                                <div>
                                                                    <p className="text-muted-foreground font-bold text-[10px] uppercase">Customer</p>
                                                                    <p className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                                                                    <p className="text-xs">{selectedOrder.email}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground font-bold text-[10px] uppercase">Shipping Address</p>
                                                                    <p className="text-xs italic">{selectedOrder.address}, {selectedOrder.city}</p>
                                                                </div>
                                                            </div>

                                                            <Separator />

                                                            <div>
                                                                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                                    <Package className="w-4 h-4" /> Order Items
                                                                </h3>
                                                                <div className="space-y-3">
                                                                    {selectedOrder.items.map((item, index) => (
                                                                        <div key={index} className="flex gap-4 border-b pb-3 last:border-0">
                                                                            <div className="h-14 w-12 rounded bg-muted overflow-hidden">
                                                                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="font-bold text-sm truncate">{item.title}</p>
                                                                                <p className="text-[10px] text-muted-foreground">{item.selectedSize} | {item.selectedColor}</p>
                                                                                <div className="flex justify-between items-center mt-1">
                                                                                    <p className="text-xs">Qty: {item.quantity}</p>
                                                                                    <p className="text-sm font-bold">${item.price}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="bg-muted/50 p-4 rounded-lg space-y-2 border">
                                                                <div className="flex justify-between font-bold text-base text-primary">
                                                                    <span>Grand Total</span>
                                                                    <span>${selectedOrder.total}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </SheetContent>
                                            </Sheet>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                        <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                        No orders found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6">
                    <PaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        totalItems={totalItems}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
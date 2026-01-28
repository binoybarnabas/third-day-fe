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
import { Search, Eye, Loader2, Package, User, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "@/components/common/pagination-control";
import { Badge } from "@/components/common/badge";
import { Separator } from "@/components/common/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/lib/api";
import * as api from "@/lib/api";
import { dummyOrders } from "@/lib/dummyData";

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
        queryFn: async () => {
            try {
                const response = await api.fetchOrders();
                return Array.isArray(response) ? response : [];
            } catch (error) {
                console.error("API fetch failed, showing dummy data only:", error);
                return [];
            }
        },
        select: (apiOrders) => [...dummyOrders, ...apiOrders]
    });

    const orders = Array.isArray(ordersData) ? ordersData : [];

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        setIsUpdating(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            if (selectedOrder) setSelectedOrder({ ...selectedOrder, status: newStatus });
            toast({ title: "Order Updated", description: `Order #${orderId} changed to ${newStatus}.` });
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

    const filteredOrders = orders.filter((order) =>
        order.id.toString().includes(searchQuery) ||
        order.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, itemsPerPage]);

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
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-heading font-bold uppercase tracking-tight mb-1 sm:mb-2 text-primary">
                            Order Management
                        </h1>
                        <p className="text-muted-foreground text-sm">Manage and track system orders</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={(e: any) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-card">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
                    ) : paginatedOrders.length > 0 ? (
                        <>
                            {/* Desktop Table: Hidden on Mobile */}
                            <div className="hidden md:block border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-bold">Order ID</TableHead>
                                            <TableHead className="font-bold">Customer</TableHead>
                                            <TableHead className="font-bold">Date</TableHead>
                                            <TableHead className="font-bold">Total</TableHead>
                                            <TableHead className="font-bold">Status</TableHead>
                                            <TableHead className="text-right font-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedOrders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-mono font-bold text-primary">#{order.id}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{order.firstName} {order.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">{order.email}</div>
                                                </TableCell>
                                                <TableCell className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-bold">${order.total}</TableCell>
                                                <TableCell><Badge className={getStatusColor(order.status)}>{order.status}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    <OrderDetailsSheet order={order} getStatusColor={getStatusColor} isUpdating={isUpdating} handleStatusChange={handleStatusChange} setSelectedOrder={setSelectedOrder} selectedOrder={selectedOrder} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card List: Hidden on Desktop */}
                            <div className="md:hidden space-y-4">
                                {paginatedOrders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-mono font-bold text-primary uppercase">#{order.id}</span>
                                                <span className="font-bold text-sm">{order.firstName} {order.lastName}</span>
                                            </div>
                                            <Badge className={`${getStatusColor(order.status)} text-[10px]`}>{order.status}</Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground py-2 border-y">
                                            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-1 justify-end font-bold text-black"><CreditCard className="w-3 h-3" /> ${order.total}</div>
                                        </div>

                                        <OrderDetailsSheet order={order} getStatusColor={getStatusColor} isUpdating={isUpdating} handleStatusChange={handleStatusChange} setSelectedOrder={setSelectedOrder} selectedOrder={selectedOrder} fullWidth />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground border rounded-md">
                            <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            No orders found matching your search.
                        </div>
                    )}
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

// Sub-component for the Details Sheet
function OrderDetailsSheet({ order, getStatusColor, isUpdating, handleStatusChange, setSelectedOrder, selectedOrder, fullWidth = false }: any) {
    return (
        <Sheet onOpenChange={(open) => !open && setSelectedOrder(null)}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className={fullWidth ? "w-full mt-2" : ""} onClick={() => setSelectedOrder(order)}>
                    <Eye className="w-4 h-4 mr-2" /> Details
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-[540px]">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="text-xl sm:text-2xl">Order #{selectedOrder?.id}</SheetTitle>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-1">
                                <p className="text-muted-foreground font-bold text-[10px] uppercase">Customer</p>
                                <p className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                                <p className="text-xs break-all">{selectedOrder.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground font-bold text-[10px] uppercase">Shipping Address</p>
                                <p className="text-xs italic leading-relaxed">{selectedOrder.address}, {selectedOrder.city}</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Package className="w-4 h-4" /> Order Items
                            </h3>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 border-b pb-3 last:border-0">
                                        <div className="h-16 w-14 rounded bg-muted overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="font-bold text-sm truncate">{item.title}</p>
                                            <p className="text-[10px] text-muted-foreground">{item.selectedSize} | {item.selectedColor}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs font-medium">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold">${item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg border">
                            <div className="flex justify-between font-bold text-base text-primary">
                                <span>Grand Total</span>
                                <span>${selectedOrder.total}</span>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
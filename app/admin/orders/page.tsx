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
import { dummyOrders } from "@/lib/dummyData";
import { Order } from "@/types/dto";
import { OrderStatus } from "@/types/enums";
import { Search, Eye, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "@/components/common/pagination-control";
import { Badge } from "@/components/common/badge";
import { Separator } from "@/components/common/separator";

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>(dummyOrders);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filteredOrders = orders.filter((order) =>
        order.id.toString().includes(searchQuery) ||
        order.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, itemsPerPage]);

    const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        toast({
            title: "Order Updated",
            description: `Order #${orderId} status changed to ${newStatus}.`,
        });
    };

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
                        <p className="text-muted-foreground">
                            Manage customer orders ({orders.length} orders)
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="border rounded-md">
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
                            {paginatedOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>
                                        <div>{order.firstName} {order.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{order.email}</div>
                                    </TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>${order.total}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" /> View
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                                                <SheetHeader>
                                                    <SheetTitle>Order Details #{selectedOrder?.id}</SheetTitle>
                                                    <SheetDescription>
                                                        View and manage order information.
                                                    </SheetDescription>
                                                </SheetHeader>

                                                {selectedOrder && (
                                                    <div className="py-6 space-y-6">
                                                        {/* Status Control */}
                                                        <div className="space-y-2">
                                                            <Label>Order Status</Label>
                                                            <Select
                                                                value={selectedOrder.status}
                                                                onValueChange={(val: any) => handleStatusChange(selectedOrder.id, val as OrderStatus)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                                                                    <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                                                                    <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                                                                    <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                                                                    <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <Separator />

                                                        {/* Customer Info */}
                                                        <div>
                                                            <h3 className="font-semibold mb-2">Customer Information</h3>
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-muted-foreground">Name</p>
                                                                    <p>{selectedOrder.firstName} {selectedOrder.lastName}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Email</p>
                                                                    <p>{selectedOrder.email}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Phone</p>
                                                                    <p>{selectedOrder.phone}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        {/* Shipping Info */}
                                                        <div>
                                                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                                                            <p className="text-sm">
                                                                {selectedOrder.address}<br />
                                                                {selectedOrder.city}, {selectedOrder.zipCode}
                                                            </p>
                                                        </div>

                                                        <Separator />

                                                        {/* Order Items */}
                                                        <div>
                                                            <h3 className="font-semibold mb-2">Order Items</h3>
                                                            <div className="space-y-4">
                                                                {selectedOrder.items.map((item, index) => (
                                                                    <div key={index} className="flex gap-4">
                                                                        <div className="h-16 w-16 rounded bg-secondary overflow-hidden flex-shrink-0">
                                                                            <img
                                                                                src={item.image}
                                                                                alt={item.title}
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-sm">{item.title}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                Size: {item.selectedSize} | Color: {item.selectedColor}
                                                                            </p>
                                                                            <div className="flex justify-between mt-1">
                                                                                <p className="text-sm">Qty: {item.quantity}</p>
                                                                                <p className="text-sm font-medium">${item.price}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        {/* Totals */}
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-muted-foreground">Subtotal</span>
                                                                <span>${selectedOrder.subtotal}</span>
                                                            </div>
                                                            <div className="flex justify-between font-bold text-lg">
                                                                <span>Total</span>
                                                                <span>${selectedOrder.total}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </SheetContent>
                                        </Sheet>
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
            </div>
        </AdminLayout>
    );
}

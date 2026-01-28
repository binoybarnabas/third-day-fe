"use client";
import { useState } from "react";
import { AdminLayout } from "@/components/ui/admin-layout";
import { Input } from "@/components/common/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/common/table";
import { fetchCustomers } from "@/lib/api";
import { Customer } from "@/types/dto";
import { Search, Loader2, User, Mail, ShoppingBag, DollarSign, Calendar } from "lucide-react";
import { PaginationControl } from "@/components/common/pagination-control";
import { useQuery } from "@tanstack/react-query";
import { dummyCustomers } from "@/lib/dummyData";

export default function CustomerManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data: customersResponse, isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            try {
                const response = await fetchCustomers();
                return Array.isArray(response) ? response : [];
            } catch (error) {
                console.error("Customer API failed, showing dummy data only:", error);
                return [];
            }
        },
        select: (apiCustomers) => [...dummyCustomers, ...apiCustomers]
    });

    const customers = customersResponse || [];

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <AdminLayout>
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-heading font-bold uppercase tracking-tight mb-1 sm:mb-2 text-primary">
                            Customer Management
                        </h1>
                        <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            Manage your base ({totalItems} customers)
                        </p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search name or email..."
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={(e: any) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-card">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Loading database...</p>
                            </div>
                        </div>
                    ) : paginatedCustomers.length > 0 ? (
                        <>
                            {/* DESKTOP VIEW: Table (Hidden on small screens) */}
                            <div className="hidden md:block border rounded-md shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-bold">Customer Name</TableHead>
                                            <TableHead className="font-bold">Email Address</TableHead>
                                            <TableHead className="font-bold">Total Orders</TableHead>
                                            <TableHead className="font-bold">Total Spent</TableHead>
                                            <TableHead className="text-right font-bold">Last Active</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedCustomers.map((customer) => (
                                            <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium">{customer.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                                                <TableCell>
                                                    <span className="bg-secondary px-2 py-0.5 rounded text-xs font-semibold">
                                                        {customer.totalOrders} orders
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-bold text-primary">
                                                    ${parseFloat(customer.totalSpent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {new Date(customer.lastOrderDate).toLocaleDateString(undefined, {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* MOBILE VIEW: Card List (Hidden on desktop) */}
                            <div className="md:hidden space-y-4">
                                {paginatedCustomers.map((customer) => (
                                    <div key={customer.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base">{customer.name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {customer.email}
                                                </span>
                                            </div>
                                            <div className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase">
                                                ID: {customer.id}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                                                    <ShoppingBag className="w-3 h-3" /> Activity
                                                </span>
                                                <span className="text-xs font-medium">{customer.totalOrders} Orders</span>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" /> Total Spent
                                                </span>
                                                <span className="text-sm font-bold text-primary">
                                                    ${parseFloat(customer.totalSpent).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Last Active:
                                            </span>
                                            <span>
                                                {new Date(customer.lastOrderDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground border rounded-md">
                            No customers found matching your search.
                        </div>
                    )}
                </div>

                {/* Pagination (Responsive) */}
                <div className="mt-6 overflow-x-auto">
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
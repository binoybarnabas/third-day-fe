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
import { Search, Loader2, User } from "lucide-react";
import { PaginationControl } from "@/components/common/pagination-control";
import { useQuery } from "@tanstack/react-query";

export default function CustomerManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch customers using TanStack Query
    const { data: customersResponse, isLoading } = useQuery({
        queryKey: ['customers'],
        queryFn: fetchCustomers,
    });

    // Safety: Ensure we are always working with an array
    const customers = Array.isArray(customersResponse) ? customersResponse : [];

    // Client-side filtering
    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">
                            Customer Management
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <User className="w-4 h-4" />
                            View and manage your customer base ({totalItems} customers)
                        </p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e: any) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="border rounded-md bg-card shadow-sm">
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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                            <p className="text-sm text-muted-foreground">Loading customer database...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedCustomers.length > 0 ? (
                                paginatedCustomers.map((customer) => (
                                    <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium">
                                            {customer.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {customer.email}
                                        </TableCell>
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
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                                        No customers found matching your search.
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
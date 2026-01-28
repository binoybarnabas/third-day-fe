"use client";

import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/common/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/common/select";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (items: number) => void;
    totalItems: number;
}

export function PaginationControl({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
}: PaginationControlProps) {
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        
        // RESPONSIVE LOGIC: Show fewer pages on mobile
        // We can check window width, but a safer CSS-friendly way is to 
        // calculate a smaller range for mobile within this logic.
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                pages.push(1, 2, 3, "ellipsis", totalPages);
            } else if (currentPage >= totalPages - 1) {
                pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "ellipsis", currentPage, "ellipsis", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col items-center justify-between gap-6 py-6 sm:flex-row sm:gap-4 sm:py-4">
            {/* Left side: Items per page selector */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground order-2 sm:order-1">
                <span className="hidden xs:inline">Show</span>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => onItemsPerPageChange(Number(value))}
                >
                    <SelectTrigger className="h-9 w-[80px] sm:h-8 sm:w-[70px]">
                        <SelectValue placeholder={itemsPerPage} />
                    </SelectTrigger>
                    <SelectContent>
                        {["10", "20", "50", "100"].map((val) => (
                            <SelectItem key={val} value={val}>{val}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="whitespace-nowrap">
                    of {totalItems.toLocaleString()} items
                </span>
            </div>

            {/* Right side: Pagination Navigation */}
            <Pagination className="order-1 sm:order-2 w-auto mx-0">
                <PaginationContent className="gap-1 sm:gap-2">
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e: any) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-accent"}
                            // Hides the "Previous" text on small screens to save space
                            size="default"
                        />
                    </PaginationItem>

                    {/* Page Numbers: Hidden on very small screens, shown on sm+ */}
                    <div className="hidden xs:flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "ellipsis" ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        href="#"
                                        isActive={page === currentPage}
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                            onPageChange(page as number);
                                        }}
                                        className="h-9 w-9 sm:h-8 sm:w-8"
                                        size={undefined}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}
                    </div>

                    {/* Simple indicator for mobile only */}
                    <div className="xs:hidden px-4 text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e: any) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:bg-accent"}
                            size="default"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
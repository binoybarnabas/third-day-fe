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
} from "@/components/common/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { 
  Search, Eye, Store, Mail, Phone, MapPin, Plus, Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "@/components/common/pagination-control";
import { Badge } from "@/components/common/badge";
import { Separator } from "@/components/common/separator";
import { ToastVariant } from "@/types/enums";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API helpers
import { fetchVendors, addVendor, updateVendorStatus } from "@/lib/api";

enum VendorStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE",
}

export default function VendorManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const [newVendorData, setNewVendorData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    status: VendorStatus.PENDING,
  });

  // --- API CALLS ---

  // 1. Fetch Vendors with Pagination & Search Query Params
  const { data: vendorResponse, isLoading } = useQuery({
    queryKey: ["vendors", currentPage, itemsPerPage, searchQuery],
    queryFn: () => fetchVendors(currentPage, itemsPerPage, searchQuery),
  });

  const vendors = vendorResponse?.vendors || [];
  const totalItems = vendorResponse?.meta?.totalItems || 0;

  // 2. Add Vendor Mutation
  const addMutation = useMutation({
    mutationFn: (data: typeof newVendorData) => addVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setIsAddSheetOpen(false);
      toast({ title: "Success", description: "Vendor added successfully." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add vendor",
        variant: ToastVariant.DESTRUCTIVE,
      });
    }
  });

  // 3. Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: VendorStatus }) => 
      updateVendorStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({ title: "Status Updated", description: "Vendor status synchronized." });
    }
  });

  // Reset Add Form
  useEffect(() => {
    if (!isAddSheetOpen) {
      setNewVendorData({
        businessName: "", ownerName: "", email: "", phone: "", address: "", status: VendorStatus.PENDING,
      });
    }
  }, [isAddSheetOpen]);

  const handleStatusChange = (vendorId: number, newStatus: VendorStatus) => {
    statusMutation.mutate({ id: vendorId, status: newStatus });
    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor({ ...selectedVendor, status: newStatus });
    }
  };

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE: return "bg-green-500 hover:bg-green-600";
      case VendorStatus.PENDING: return "bg-yellow-500 hover:bg-yellow-600";
      case VendorStatus.SUSPENDED: return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500";
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">Vendor Management</h1>
            <p className="text-muted-foreground">Manage marketplace sellers</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search vendors..." 
                className="pl-8" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>

            {/* ADD VENDOR SHEET */}
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button className="uppercase tracking-widest font-bold rounded-none gap-2">
                  <Plus className="w-4 h-4" /> Add Vendor
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Add New Vendor</SheetTitle>
                  <SheetDescription>Register a new seller account.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-6">
                  <div className="grid gap-2">
                    <Label>Business Name *</Label>
                    <Input value={newVendorData.businessName} onChange={(e) => setNewVendorData({...newVendorData, businessName: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Owner Name *</Label>
                    <Input value={newVendorData.ownerName} onChange={(e) => setNewVendorData({...newVendorData, ownerName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Email *</Label>
                      <Input type="email" value={newVendorData.email} onChange={(e) => setNewVendorData({...newVendorData, email: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Phone</Label>
                      <Input value={newVendorData.phone} onChange={(e) => setNewVendorData({...newVendorData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Address</Label>
                    <Input value={newVendorData.address} onChange={(e) => setNewVendorData({...newVendorData, address: e.target.value})} />
                  </div>
                </div>
                <SheetFooter>
                  <Button className="w-full" onClick={() => addMutation.mutate(newVendorData)} disabled={addMutation.isPending}>
                    {addMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Save Vendor
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* TABLE */}
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Business Details</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
              ) : vendors.map((vendor: any) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">VND-{vendor.id}</TableCell>
                  <TableCell>
                    <div className="font-bold">{vendor.businessName}</div>
                    <div className="text-xs text-muted-foreground">{vendor.ownerName} • {vendor.email}</div>
                  </TableCell>
                  <TableCell>{vendor.productCount || 0} items</TableCell>
                  <TableCell><Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(vendor)}>
                          <Eye className="w-4 h-4 mr-2" /> Manage
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Vendor Profile</SheetTitle>
                          <SheetDescription>Review credentials and store settings.</SheetDescription>
                        </SheetHeader>

                        {selectedVendor && (
                          <div className="py-6 space-y-6">
                            <div className="space-y-2">
                              <Label>Account Status</Label>
                              <Select value={selectedVendor.status} onValueChange={(val: any) => handleStatusChange(selectedVendor.id, val as VendorStatus)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={VendorStatus.ACTIVE}>Active / Verified</SelectItem>
                                  <SelectItem value={VendorStatus.PENDING}>Pending Review</SelectItem>
                                  <SelectItem value={VendorStatus.SUSPENDED}>Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                              <h3 className="font-semibold flex items-center gap-2"><Store className="w-4 h-4" /> Business Information</h3>
                              <div className="bg-secondary/30 p-3 rounded-lg">
                                <p className="text-muted-foreground text-xs uppercase font-bold">Store Name</p>
                                <p className="text-base font-medium">{selectedVendor.businessName}</p>
                              </div>
                              <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                                <div><p className="font-medium">{selectedVendor.email}</p><p className="text-xs text-muted-foreground">Primary Contact</p></div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                                <div><p className="font-medium">{selectedVendor.phone || "N/A"}</p></div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                                <div><p className="text-sm">{selectedVendor.address}</p></div>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-3">Performance Overview</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-md p-3"><p className="text-xs text-muted-foreground">Total Sales</p><p className="text-xl font-bold">${selectedVendor.totalSales || "0.00"}</p></div>
                                <div className="border rounded-md p-3"><p className="text-xs text-muted-foreground">Commission</p><p className="text-xl font-bold">{selectedVendor.commission || "10"}%</p></div>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" className="w-full">View Store Products</Button>
                              <Button variant="destructive" className="w-full">Suspend Vendor Account</Button>
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
          totalPages={Math.ceil(totalItems / itemsPerPage)} 
          onPageChange={setCurrentPage} 
          itemsPerPage={itemsPerPage} 
          onItemsPerPageChange={setItemsPerPage} 
          totalItems={totalItems} 
        />
      </div>
    </AdminLayout>
  );
}
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
  Search, Eye, Store, Mail, Phone, MapPin, Plus, Loader2, Edit3, Check 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "@/components/common/pagination-control";
import { Badge } from "@/components/common/badge";
import { Separator } from "@/components/common/separator";
import { ToastVariant } from "@/types/enums";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API helpers
import { get, post, put } from "@/utils/api";

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
  
  // States for Selection and Editing
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // New Vendor Form State
  const [newVendorData, setNewVendorData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    status: VendorStatus.PENDING,
  });

  // --- API CALLS ---

  // 1. Fetch Vendors (Paginated and Filtered)
  const { data: vendorResponse, isLoading } = useQuery({
    queryKey: ["vendors", currentPage, itemsPerPage, searchQuery],
    queryFn: () => get<any>(`/vendors?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`),
  });

  const vendors = vendorResponse?.data?.vendors || [];
  const totalItems = vendorResponse?.data?.meta?.totalItems || 0;

  // 2. Add Vendor Mutation
  const addMutation = useMutation({
    mutationFn: (data: typeof newVendorData) => post("/vendors", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setIsAddSheetOpen(false);
      toast({ title: "Success", description: "Vendor added successfully." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add vendor",
        variant: ToastVariant.DESTRUCTIVE,
      });
    }
  });

  // 3. Update Vendor Mutation (Profile & Status)
  const updateMutation = useMutation({
    mutationFn: (data: any) => put(`/vendors/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setIsEditMode(false);
      toast({ title: "Success", description: "Vendor updated successfully." });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Could not update vendor",
        variant: ToastVariant.DESTRUCTIVE,
      });
    }
  });

  // --- HANDLERS ---

  // Reset Add Form when closed
  useEffect(() => {
    if (!isAddSheetOpen) {
      setNewVendorData({
        businessName: "", ownerName: "", email: "", phone: "", address: "", status: VendorStatus.PENDING,
      });
    }
  }, [isAddSheetOpen]);

  const handleStatusChange = (vendorId: number, newStatus: VendorStatus) => {
    // Immediate update for better UX, then mutation handles server sync
    const updated = { ...selectedVendor, status: newStatus };
    setSelectedVendor(updated);
    updateMutation.mutate(updated);
  };

  const handleSaveChanges = () => {
    if (selectedVendor) {
      updateMutation.mutate(selectedVendor);
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
            <p className="text-muted-foreground">Monitor and manage seller accounts</p>
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

            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button className="uppercase tracking-widest font-bold rounded-none gap-2">
                  <Plus className="w-4 h-4" /> Add Vendor
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Add New Vendor</SheetTitle>
                  <SheetDescription>Register a new marketplace seller account.</SheetDescription>
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
              ) : vendors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No vendors found.</TableCell></TableRow>
              ) : vendors.map((vendor: any) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium text-xs">#VND-{vendor.id}</TableCell>
                  <TableCell>
                    <div className="font-bold">{vendor.businessName}</div>
                    <div className="text-xs text-muted-foreground">{vendor.ownerName} • {vendor.email}</div>
                  </TableCell>
                  <TableCell>{vendor.productCount || 0}</TableCell>
                  <TableCell><Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Sheet onOpenChange={(open) => { if(!open) setIsEditMode(false) }}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(vendor)}>
                          <Eye className="w-4 h-4 mr-2" /> Manage
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                        <SheetHeader className="flex flex-row items-center justify-between mr-8">
                          <div className="flex flex-col">
                            <SheetTitle>Vendor Profile</SheetTitle>
                            <SheetDescription>Review or update store information.</SheetDescription>
                          </div>
                          <Button 
                            variant={isEditMode ? "ghost" : "outline"} 
                            size="sm" 
                            onClick={() => setIsEditMode(!isEditMode)}
                          >
                            {isEditMode ? "Cancel" : <><Edit3 className="w-4 h-4 mr-2" /> Edit Profile</>}
                          </Button>
                        </SheetHeader>

                        {selectedVendor && (
                          <div className="py-6 space-y-6">
                            {/* --- STATUS --- */}
                            <div className="space-y-2">
                              <Label>Account Status</Label>
                              <Select value={selectedVendor.status} onValueChange={(val: any) => handleStatusChange(selectedVendor.id, val as VendorStatus)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={VendorStatus.ACTIVE}>Active / Verified</SelectItem>
                                  <SelectItem value={VendorStatus.PENDING}>Pending Review</SelectItem>
                                  <SelectItem value={VendorStatus.SUSPENDED}>Suspended</SelectItem>
                                  <SelectItem value={VendorStatus.INACTIVE}>Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Separator />

                            {/* --- EDITABLE FORM --- */}
                            <div className="space-y-4">
                              <h3 className="font-semibold flex items-center gap-2 uppercase tracking-wider text-xs text-muted-foreground">
                                <Store className="w-4 h-4" /> Business Information
                              </h3>
                              
                              {isEditMode ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                   <div className="grid gap-2">
                                      <Label>Store Name</Label>
                                      <Input 
                                        value={selectedVendor.businessName} 
                                        onChange={(e) => setSelectedVendor({...selectedVendor, businessName: e.target.value})}
                                      />
                                   </div>
                                   <div className="grid gap-2">
                                      <Label>Owner Name</Label>
                                      <Input 
                                        value={selectedVendor.ownerName} 
                                        onChange={(e) => setSelectedVendor({...selectedVendor, ownerName: e.target.value})}
                                      />
                                   </div>
                                   <div className="grid gap-2">
                                      <Label>Phone</Label>
                                      <Input 
                                        value={selectedVendor.phone} 
                                        onChange={(e) => setSelectedVendor({...selectedVendor, phone: e.target.value})}
                                      />
                                   </div>
                                   <div className="grid gap-2">
                                      <Label>Address</Label>
                                      <Input 
                                        value={selectedVendor.address} 
                                        onChange={(e) => setSelectedVendor({...selectedVendor, address: e.target.value})}
                                      />
                                   </div>
                                   <Button className="w-full gap-2" onClick={handleSaveChanges} disabled={updateMutation.isPending}>
                                     {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                     Save Changes
                                   </Button>
                                </div>
                              ) : (
                                <div className="grid gap-4">
                                  <div className="bg-secondary/30 p-3 rounded-lg">
                                    <p className="text-muted-foreground text-xs uppercase font-bold text-[10px]">Store Identity</p>
                                    <p className="text-base font-medium">{selectedVendor.businessName}</p>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><p className="font-medium text-sm">{selectedVendor.email}</p></div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><p className="font-medium text-sm">{selectedVendor.phone || "N/A"}</p></div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                                    <div><p className="text-sm text-muted-foreground">{selectedVendor.address}</p></div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Separator />

                            {/* --- STATS (HIDDEN IN EDIT MODE) --- */}
                            {!isEditMode && (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-md p-3">
                                  <p className="text-[10px] text-muted-foreground uppercase">Total Sales</p>
                                  <p className="text-lg font-bold">${selectedVendor.totalSales || "0.00"}</p>
                                </div>
                                <div className="border rounded-md p-3">
                                  <p className="text-[10px] text-muted-foreground uppercase">Commission</p>
                                  <p className="text-lg font-bold">{selectedVendor.commission || "10"}%</p>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col gap-2 pt-4">
                              <Button variant="outline" className="w-full">View Store Products</Button>
                              <Button variant="destructive" className="w-full">Suspend Vendor</Button>
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
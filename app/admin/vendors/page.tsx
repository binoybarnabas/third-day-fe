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

import * as api from "@/lib/api";
import { dummyVendors } from "@/lib/dummyData";

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
  const [isEditMode, setIsEditMode] = useState(false);

  const [newVendorData, setNewVendorData] = useState({
    businessName: "", ownerName: "", email: "", phone: "", address: "", status: VendorStatus.PENDING,
  });

  const { data: vendorData, isLoading } = useQuery({
    queryKey: ["vendors", currentPage, itemsPerPage, searchQuery],
    queryFn: async () => {
      try {
        return await api.fetchVendors(currentPage, itemsPerPage, searchQuery);
      } catch (error) {
        return { vendors: [], meta: { totalItems: 0 } };
      }
    },
    select: (apiData) => {
      const filteredDummy = dummyVendors.filter((v) =>
        v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const combinedVendors = currentPage === 1 
        ? [...filteredDummy, ...(apiData?.vendors || [])] 
        : (apiData?.vendors || []);

      return {
        vendors: combinedVendors,
        meta: {
          totalItems: (apiData?.meta?.totalItems || 0) + filteredDummy.length,
        },
      };
    },
  });

  const vendors = vendorData?.vendors || [];
  const totalItems = vendorData?.meta?.totalItems || 0;

  const addMutation = useMutation({
    mutationFn: api.addVendor,
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

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateVendor(data.id, data),
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

  useEffect(() => {
    if (!isAddSheetOpen) {
      setNewVendorData({
        businessName: "", ownerName: "", email: "", phone: "", address: "", status: VendorStatus.PENDING,
      });
    }
  }, [isAddSheetOpen]);

  const handleStatusChange = (vendorId: number, newStatus: VendorStatus) => {
    const updated = { ...selectedVendor, id: vendorId, status: newStatus };
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div className="w-full">
            <h1 className="text-2xl sm:text-4xl font-heading font-bold uppercase tracking-tight mb-1 sm:mb-2 text-primary">Vendor Management</h1>
            <p className="text-muted-foreground text-sm">Monitor and manage seller accounts</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search vendors..." 
                className="pl-8 w-full" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>

            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button className="uppercase tracking-widest font-bold rounded-none gap-2 px-6 w-full sm:w-auto">
                  <Plus className="w-4 h-4" /> Add Vendor
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto w-full sm:max-w-[540px]">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Content Section */}
        <div className="bg-card">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground border rounded-md">No vendors found.</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Vendor ID</TableHead>
                      <TableHead className="font-bold">Business Details</TableHead>
                      <TableHead className="font-bold">Products</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor: any) => (
                      <TableRow key={vendor.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium text-xs">#VND-{vendor.id}</TableCell>
                        <TableCell>
                          <div className="font-bold text-sm">{vendor.businessName}</div>
                          <div className="text-xs text-muted-foreground">{vendor.ownerName} • {vendor.email}</div>
                        </TableCell>
                        <TableCell>{vendor.productCount || 0}</TableCell>
                        <TableCell><Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <VendorManageSheet vendor={vendor} getStatusColor={getStatusColor} handleStatusChange={handleStatusChange} isEditMode={isEditMode} setIsEditMode={setIsEditMode} selectedVendor={selectedVendor} setSelectedVendor={setSelectedVendor} handleSaveChanges={handleSaveChanges} updateMutation={updateMutation} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {vendors.map((vendor: any) => (
                  <div key={vendor.id} className="border rounded-lg p-4 shadow-sm bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-bold">#VND-{vendor.id}</p>
                        <h3 className="font-bold text-base leading-tight">{vendor.businessName}</h3>
                        <p className="text-xs text-muted-foreground">{vendor.ownerName}</p>
                      </div>
                      <Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1"><Store className="w-3 h-3"/> {vendor.productCount || 0} Products</div>
                    </div>

                    <VendorManageSheet vendor={vendor} getStatusColor={getStatusColor} handleStatusChange={handleStatusChange} isEditMode={isEditMode} setIsEditMode={setIsEditMode} selectedVendor={selectedVendor} setSelectedVendor={setSelectedVendor} handleSaveChanges={handleSaveChanges} updateMutation={updateMutation} mobileFullWidth />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 overflow-x-auto">
          <PaginationControl 
            currentPage={currentPage} 
            totalPages={Math.ceil(totalItems / itemsPerPage)} 
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

// Sub-component for the Manage Sheet to keep the main component cleaner
function VendorManageSheet({ vendor, getStatusColor, handleStatusChange, isEditMode, setIsEditMode, selectedVendor, setSelectedVendor, handleSaveChanges, updateMutation, mobileFullWidth = false }: any) {
  return (
    <Sheet onOpenChange={(open) => { if(!open) setIsEditMode(false) }}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={mobileFullWidth ? "w-full" : ""} onClick={() => setSelectedVendor(vendor)}>
          <Eye className="w-4 h-4 mr-2" /> Manage
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full sm:max-w-[540px]">
        <SheetHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mr-8">
            <div className="flex flex-col">
              <SheetTitle>Vendor Profile</SheetTitle>
              <SheetDescription>Review or update store information.</SheetDescription>
            </div>
            <Button 
              variant={isEditMode ? "ghost" : "outline"} 
              size="sm" 
              onClick={() => setIsEditMode(!isEditMode)}
              className="gap-2 w-full sm:w-auto"
            >
              {isEditMode ? "Cancel" : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
            </Button>
          </div>
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
                  <SelectItem value={VendorStatus.INACTIVE}>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-primary">
                <Store className="w-4 h-4" /> Store Information
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
                    <Button className="w-full gap-2 h-10" onClick={handleSaveChanges} disabled={updateMutation.isPending}>
                       {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                       Save Changes
                    </Button>
                </div>
              ) : (
                <div className="grid gap-4 shadow-sm border rounded-xl p-4 bg-background">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Store Identity</p>
                    <p className="text-base font-medium">{selectedVendor.businessName}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-1 text-primary shrink-0" />
                    <div className="min-w-0 flex-1"><p className="font-medium text-sm break-all">{selectedVendor.email}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-1 text-primary shrink-0" />
                    <div><p className="font-medium text-sm">{selectedVendor.phone || "N/A"}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-primary shrink-0" />
                    <div><p className="text-sm text-muted-foreground">{selectedVendor.address}</p></div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {!isEditMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Sales</p>
                  <p className="text-lg font-bold text-primary">${selectedVendor.totalSales || "0.00"}</p>
                </div>
                <div className="border rounded-md p-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Commission</p>
                  <p className="text-lg font-bold text-primary">{selectedVendor.commission || "10"}%</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" className="w-full">View Store Products</Button>
              <Button variant="destructive" className="w-full font-bold uppercase tracking-tighter">Suspend Vendor</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
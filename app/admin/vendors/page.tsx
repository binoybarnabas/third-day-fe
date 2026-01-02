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
import { dummyVendors } from "@/lib/dummyData";
import {
  Search,
  Eye,
  Store,
  Mail,
  Phone,
  MapPin,
  Plus,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControl } from "@/components/common/pagination-control";
import { Badge } from "@/components/common/badge";
import { Separator } from "@/components/common/separator";
import { ToastVariant } from "@/types/enums";

enum VendorStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE",
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<any[]>(dummyVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  // --- ADD VENDOR STATES ---
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    status: VendorStatus.PENDING,
  });

  useEffect(() => {
    if (!isAddSheetOpen) {
      setNewVendorData({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        status: VendorStatus.PENDING,
      });
    }
  }, [isAddSheetOpen]);

  const filteredVendors = vendors.filter(
    (v) =>
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddVendor = async () => {
    if (!newVendorData.businessName || !newVendorData.email || !newVendorData.ownerName) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in Business Name, Owner, and Email.",
        variant: ToastVariant.DESTRUCTIVE,
      });
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      const newEntry = {
        ...newVendorData,
        id: vendors.length + 1,
        productCount: 0,
        createdAt: new Date().toISOString(),
        totalSales: "0.00",
        commission: "10",
      };
      setVendors([newEntry, ...vendors]);
      setIsSaving(false);
      setIsAddSheetOpen(false);
      toast({ title: "Vendor Registered", description: "Account created successfully." });
    }, 800);
  };

  const handleStatusChange = (vendorId: number, newStatus: VendorStatus) => {
    setVendors(vendors.map((v) => (v.id === vendorId ? { ...v, status: newStatus } : v)));
    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor({ ...selectedVendor, status: newStatus });
    }
    toast({ title: "Status Updated", description: `Vendor is now ${newStatus}.` });
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
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">Vendor Management</h1>
            <p className="text-muted-foreground">Manage your marketplace sellers ({vendors.length} vendors)</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search vendors..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                  <Button className="w-full" onClick={handleAddVendor} disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Save Vendor
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
                <TableHead>Join Date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">VND-{vendor.id}</TableCell>
                  <TableCell>
                    <div className="font-bold">{vendor.businessName}</div>
                    <div className="text-xs text-muted-foreground">{vendor.ownerName} • {vendor.email}</div>
                  </TableCell>
                  <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
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

        <PaginationControl currentPage={currentPage} totalPages={Math.ceil(filteredVendors.length / itemsPerPage)} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} totalItems={filteredVendors.length} />
      </div>
    </AdminLayout>
  );
}
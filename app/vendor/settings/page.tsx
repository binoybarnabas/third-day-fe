"use client";
import { useState, useEffect } from "react";
import { VendorLayout } from "@/components/ui/vendor-layout";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/common/card";
import { Separator } from "@/components/common/separator";
import {  User, Store, Mail, MapPin, Phone, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageLoader } from "@/components/common/page-loader";

export default function VendorSettingsPage() {
  const { data: profile, isLoading: isFetching } = useQuery({
    queryKey: ['vendorProfile'],
    queryFn: api.fetchVendorProfile,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    storeName: "",
    storeDescription: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: api.updateVendorProfile,
    onSuccess: () => {
      toast.success("Settings saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save settings.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isFetching) {
    return (
      <VendorLayout>
         <div className="flex justify-center items-center h-64">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="mb-6">
        <PageLoader />
        <h1 className="text-2xl font-heading font-bold uppercase tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile and store preferences</p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <CardDescription>Your personal contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      className="pl-9" 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      name="phone" 
                      className="pl-9" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  <CardTitle>Store Information</CardTitle>
                </div>
                <CardDescription>Details about your public store profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input 
                    id="storeName" 
                    name="storeName" 
                    value={formData.storeName} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Input 
                    id="storeDescription" 
                    name="storeDescription" 
                    value={formData.storeDescription} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="address" 
                      name="address" 
                      className="pl-9" 
                      value={formData.address} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}

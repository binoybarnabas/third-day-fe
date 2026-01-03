"use client";
import { VendorLayout } from "@/components/ui/vendor-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";

export default function VendorDashboard() {
  // Static data for vendor demo
  const stats = {
    totalRevenue: "12,450",
    totalOrders: 145,
    productsCount: 24,
    todaySales: 3
  };

  const statCards = [
    { title: "Total Revenue", value: `$${stats.totalRevenue}`, icon: DollarSign, change: "+12.5% from last month" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, change: `${stats.todaySales} new today` },
    { title: "My Products", value: stats.productsCount, icon: Package, change: "+2 added this week" },
    { title: "Performance", value: "98%", icon: TrendingUp, change: "Customer rating" },
  ];

  return (
    <VendorLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">No recent orders found.</p>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground text-center py-8">No data available.</p>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}

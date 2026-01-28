"use client";
import { VendorLayout } from "@/components/ui/vendor-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { DollarSign, Package, ShoppingBag, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/common/button";

export default function VendorDashboard() {

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['vendorStats'],
    queryFn: api.fetchVendorStats,
  });

  const { data: recentOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['vendorRecentOrders'],
    queryFn: () => api.fetchVendorOrders(5),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['vendorTopProducts'],
    queryFn: api.fetchVendorProducts,
  });

  const topProducts = products.slice(0, 5);

  const statCards = [
    { 
      title: "Total Revenue", 
      value: stats ? `$${stats.totalRevenue}` : "...", 
      icon: DollarSign, 
      change: "+12.5% from last month",
      loading: statsLoading
    },
    { 
      title: "Total Orders", 
      value: stats ? stats.totalOrders : "...", 
      icon: ShoppingBag, 
      change: stats ? `${stats.todaySales} new today` : "...",
      loading: statsLoading
    },
    { 
      title: "My Products", 
      value: stats ? stats.productsCount : "...", 
      icon: Package, 
      change: "+2 added this week",
      loading: statsLoading
    },
    { 
      title: "Performance", 
      value: "98%", 
      icon: TrendingUp, 
      change: "Customer rating",
      loading: statsLoading
    },
  ];

  return (
    <VendorLayout>
      {/* Responsive Stats Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Stacks vertically on mobile/tablet, side-by-side on lg screens */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        
        {/* Recent Orders - Spans 4/7 of width on desktop */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
               <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : recentOrders.length === 0 ? (
               <p className="text-muted-foreground text-center py-8">No recent orders found.</p>
            ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-2">
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                         <div className="text-sm font-bold">${order.total}</div>
                         <div className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${
                           order.status === 'delivered' 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {order.status}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>
        
        {/* Top Products - Spans 3/7 of width on desktop */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
               <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : topProducts.length === 0 ? (
               <p className="text-muted-foreground text-center py-8">No data available.</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-secondary overflow-hidden shrink-0">
                      <img src={product.images[0] || "/placeholder.png"} alt={product.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">${product.price}</p>
                    </div>
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded shrink-0">
                      Top Seller
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t text-center">
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/vendor/products">View All Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}
"use client";
import { AdminLayout } from "@/components/ui/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/common/skeleton";
import { Stat } from "@/types/dto";

export default function AdminDashboard() {
    const { data: stats, isLoading: statsLoading } = useQuery<Stat>({
        queryKey: ['admin', 'stats'],
        queryFn: api.fetchAdminStats,
    });

  const { data: allOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: api.fetchAllOrders,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: api.fetchProducts,
  });

  const recentOrders = allOrders.slice(0, 5);

  const statCards = [
    { title: "Total Revenue", value: stats ? `$${stats.totalRevenue}` : "$0", icon: DollarSign, change: "+20.1% from last month" },
    { title: "Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, change: `${stats?.todayOrders || 0} today` },
    { title: "Products", value: products.length, icon: Package, change: "+12 new products" },
    { title: "Active Now", value: "+573", icon: TrendingUp, change: "+201 since last hour" },
  ];

  return (
    <AdminLayout>
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
              {statsLoading || productsLoading ? (
                <Skeleton className="h-8 w-24" />
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-8">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.firstName} {order.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Order #{order.id}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">${order.total}</div>
                    <div className={`ml-4 text-xs px-2 py-1 rounded-full ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center">
                    <div className="h-9 w-9 rounded bg-secondary overflow-hidden">
                      <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{product.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">${parseFloat(product.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

"use client";
import { AdminLayout } from "@/components/ui/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/card";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/common/skeleton";
import { Stat, Order, Product } from "@/types/dto";

export default function AdminDashboard() {
    // Fetch Stats
    const { data: stats, isLoading: statsLoading } = useQuery<Stat>({
        queryKey: ['admin', 'stats'],
        queryFn: api.fetchAdminStats,
    });

    // Fetch Orders
    const { data: allOrdersResponse, isLoading: ordersLoading } = useQuery({
        queryKey: ['admin', 'orders'],
        queryFn: api.fetchAllOrders,
    });

    // Fetch Products
    const { data: productsResponse, isLoading: productsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: api.fetchProducts,
    });

    // Safety checks
    const allOrders = Array.isArray(allOrdersResponse) ? allOrdersResponse : [];
    const products = Array.isArray(productsResponse) ? productsResponse : [];
    const recentOrders = allOrders.slice(0, 5);

    const statCards = [
        { 
            title: "Total Revenue", 
            value: stats ? `$${Number(stats.totalRevenue).toLocaleString()}` : "$0", 
            icon: DollarSign, 
            change: stats?.revenueChange || "+0% from last month" 
        },
        { 
            title: "Orders", 
            value: stats?.totalOrders || 0, 
            icon: ShoppingBag, 
            change: `${stats?.todayOrders || 0} today` 
        },
        { 
            title: "Products", 
            value: products.length, 
            icon: Package, 
            change: "+12 new products" 
        },
        { 
            title: "Active Now", 
            value: "+573", 
            icon: TrendingUp, 
            change: "+201 since last hour" 
        },
    ];

    return (
        <AdminLayout>
            {/* Reduced padding on mobile (p-4 vs p-6) */}
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Real-time overview of your store performance.</p>
                </div>

                {/* Stats Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {statsLoading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Content Grid: Stacks vertically on mobile/tablet, side-by-side on large screens only */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                    
                    {/* Recent Orders Section */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ordersLoading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                                </div>
                            ) : recentOrders.length > 0 ? (
                                <div className="space-y-6 sm:space-y-8">
                                    {recentOrders.map((order: Order) => (
                                        <div key={order.id} className="flex items-center gap-2">
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <p className="text-sm font-medium leading-none truncate">
                                                    {order.firstName} {order.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Order #{order.id}</p>
                                            </div>
                                            <div className="text-sm font-bold">${order.total}</div>
                                            {/* Status Badge: Smaller text and padding on mobile */}
                                            <div className={`text-[9px] sm:text-[10px] uppercase px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
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
                    
                    {/* Top Products Section */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-lg">Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {productsLoading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                                </div>
                            ) : (
                                <div className="space-y-6 sm:space-y-8">
                                    {products.slice(0, 5).map((product: Product) => (
                                        <div key={product.id} className="flex items-center">
                                            <div className="h-9 w-9 rounded bg-muted overflow-hidden shrink-0">
                                                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="ml-4 space-y-1 min-w-0 flex-1">
                                                <p className="text-sm font-medium leading-none truncate">{product.title}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase">{product.category}</p>
                                            </div>
                                            <div className="ml-2 text-sm font-bold">${parseFloat(product.price).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppRoutes } from "@/types/enums";
import {
  LayoutDashboard,
  UserRound,
  ShoppingBag,
  Users,
  Package,
  LogOut,
  Menu // Import Menu icon
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/common/sheet";
import { Button } from "@/components/common/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: AppRoutes.ADMIN_DASHBOARD },
    { icon: Package, label: "Products", href: AppRoutes.ADMIN_PRODUCTS },
    { icon: UserRound, label: "Vendors", href: AppRoutes.ADMIN_VENDORS },
    { icon: ShoppingBag, label: "Orders", href: AppRoutes.ADMIN_ORDERS },
    { icon: Users, label: "Customers", href: AppRoutes.ADMIN_CUSTOMERS },
  ];

  // Reusable Sidebar Content
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-xl font-heading font-bold uppercase tracking-tighter">
          Street•Wear <span className="text-neutral-500 text-sm block font-sans normal-case tracking-normal">Admin Panel</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              location === item.href
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <Link
          href={AppRoutes.HOME}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden lg:flex w-64 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="bg-white border-b px-4 lg:px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 bg-black border-none">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wide">
              {navItems.find(item => item.href === location)?.label || "Dashboard Overview"}
            </h2>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
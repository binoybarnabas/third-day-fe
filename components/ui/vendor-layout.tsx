"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppRoutes } from "@/types/enums";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/common/sheet";
import { Button } from "@/components/common/button";
import { APP_CONFIG } from "@/lib/constants";

export function VendorLayout({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: AppRoutes.VENDOR_DASHBOARD,
    },
    { icon: Package, label: "My Products", href: AppRoutes.VENDOR_PRODUCTS },
    { icon: ShoppingBag, label: "Orders", href: AppRoutes.VENDOR_ORDERS },
    { icon: Settings, label: "Settings", href: AppRoutes.VENDOR_SETTINGS },
  ];

  const brandParts = APP_CONFIG.BRAND_NAME.split(" ");
  const boldPart = brandParts.slice(0, 2).join(" ");
  const lightPart = brandParts.slice(2).join(" ");

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-xl uppercase tracking-tighter leading-none">
          <span className="font-black">{boldPart}</span>
          <span className="font-light ml-1">{lightPart}</span>
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
          href={AppRoutes.VENDOR_LOGIN}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <aside className="hidden lg:flex w-64 flex-col sticky top-0 h-screen shadow-xl">
        <SidebarContent />
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="bg-white border-b px-4 lg:px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-neutral-100"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="p-0 w-64 bg-black border-none"
                >
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>

            <h2 className="text-lg font-bold uppercase tracking-wide">
              {navItems.find((item) => item.href === location)?.label ||
                "Vendor Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden xs:inline text-sm font-medium text-neutral-600">
              Welcome, Vendor
            </span>
            <div className="h-8 w-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              V
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

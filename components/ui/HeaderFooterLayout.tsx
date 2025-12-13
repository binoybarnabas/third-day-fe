"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, Search, User, Heart } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CartDrawer } from "./cart-drawer";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/common/sheet";
import { AppRoutes } from "@/types/enums";

export function HeaderFooterLayout({ children }: { children: React.ReactNode }) {
  const { cartCount, setIsCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [location] = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: AppRoutes.MEN, label: "Men" },
    { href: AppRoutes.WOMEN, label: "Women" },
    { href: AppRoutes.NEW_ARRIVALS, label: "New Arrivals" },
    { href: AppRoutes.ACCESSORIES, label: "Accessories" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Announcement Bar */}
      <div className="bg-black text-white text-xs text-center py-2 uppercase tracking-widest font-medium">
        Free shipping on orders over $150
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <div className="p-6 flex flex-col gap-6 mt-10">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t pt-6 space-y-4">
                    <Link href={AppRoutes.ACCOUNT} className="flex items-center gap-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <Link href={AppRoutes.WISHLIST} className="flex items-center gap-2 text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <Heart className="h-4 w-4" /> Wishlist
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link href={AppRoutes.HOME} className="text-2xl font-heading font-bold tracking-tighter uppercase">
              Street<span className="text-muted-foreground">•</span>Wear
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors ${location === link.href ? "text-black border-b-2 border-black" : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex w-64 relative">
              <Input
                type="search"
                placeholder="SEARCH..."
                className="h-9 bg-secondary border-none rounded-none text-xs focus-visible:ring-1 pl-8 uppercase placeholder:text-muted-foreground/70"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <Button variant="ghost" size="icon" className="hidden lg:flex" asChild>
              <Link href={AppRoutes.ACCOUNT}>
                <User className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="hidden lg:flex relative" asChild>
              <Link href={AppRoutes.WISHLIST}>
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <h4 className="text-xl font-heading font-bold uppercase">Street•Wear</h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Redefining modern streetwear with minimalist aesthetics and premium quality materials.
              </p>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider mb-4 text-sm">Shop</h5>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href={AppRoutes.MEN} className="hover:text-white">Men</Link></li>
                <li><Link href={AppRoutes.WOMEN} className="hover:text-white">Women</Link></li>
                <li><Link href={AppRoutes.ACCESSORIES} className="hover:text-white">Accessories</Link></li>
                <li><Link href={AppRoutes.NEW_ARRIVALS} className="hover:text-white">New Arrivals</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider mb-4 text-sm">Help</h5>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href={AppRoutes.SHIPPING} className="hover:text-white">Shipping & Returns</Link></li>
                <li><Link href={AppRoutes.FAQ} className="hover:text-white">FAQ</Link></li>
                <li><Link href={AppRoutes.CONTACT} className="hover:text-white">Contact Us</Link></li>
                <li><Link href={AppRoutes.SIZE_GUIDE} className="hover:text-white">Size Guide</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider mb-4 text-sm">Newsletter</h5>
              <p className="text-neutral-400 text-sm mb-4">Subscribe for exclusive drops and offers.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="EMAIL ADDRESS"
                  className="bg-neutral-900 border-neutral-800 text-white rounded-none h-10 text-xs uppercase placeholder:text-neutral-600 focus-visible:ring-white"
                />
                <Button className="bg-white text-black hover:bg-neutral-200 rounded-none h-10 px-6 font-bold uppercase text-xs">
                  Join
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 uppercase">
            <p>© 2025 Street•Wear. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href={AppRoutes.PRIVACY} className="hover:text-white">Privacy Policy</Link>
              <Link href={AppRoutes.TERMS} className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}

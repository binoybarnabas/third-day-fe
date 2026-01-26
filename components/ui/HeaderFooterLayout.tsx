"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, Search, User, Heart,X } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CartDrawer } from "./cart-drawer";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/common/sheet";
import { AppRoutes } from "@/types/enums";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function HeaderFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cartCount, setIsCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          {/* Mobile Menu & Search Icon */}
          <div className="lg:hidden flex items-center gap-1">
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
                    <Link
                      href={AppRoutes.ACCOUNT}
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" /> My Account
                    </Link>
                    <Link
                      href={AppRoutes.WISHLIST}
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4" /> Wishlist
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Mobile Search Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>

          {/* Logo Container */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link href={AppRoutes.HOME} className="flex items-center">
              <div className="lg:hidden block">
                <Image
                  src="/images/logos/logo_black_png.png"
                  alt="Streetwear Mobile Logo"
                  width={70}
                  height={70}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="hidden lg:block">
                <Image
                  src="/images/logos/logo_full_black_png.png"
                  alt="Third Day Atelier Desktop Logo"
                  width={380} // Back to your original size
                  height={50} // Back to your original size
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wide hover:text-muted-foreground transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? "text-black border-b-2 border-black"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex w-64 relative group">
              <Input
                type="search"
                placeholder="Search..."
                className="h-9 bg-secondary/50 border-transparent rounded-full text-xs focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-primary pl-9 uppercase placeholder:text-muted-foreground/70 transition-all duration-300 hover:bg-secondary/80 focus:bg-background focus:ring-1 focus:w-full"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              asChild
            >
              <Link href={AppRoutes.ACCOUNT}>
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Wishlist Icon: Removed 'hidden lg:flex' so it's visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              asChild
            >
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

        {/* Animated Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden w-full bg-background border-b border-border overflow-hidden"
            >
              <div className="p-4">
                <div className="relative">
                  <Input 
                    autoFocus 
                    placeholder="SEARCH PRODUCTS..." 
                    className="h-12 bg-secondary border-none rounded-none uppercase text-sm pl-10" 
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white pt-12 pb-8">
        <div className="container mx-auto px-6 md:px-4">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-12 mb-12">
            {/* 1. Brand Section - Takes full width on mobile, 1 col on desktop */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <h4 className="text-xl font-heading font-bold uppercase tracking-tighter">
                Street•Wear
              </h4>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                Redefining modern streetwear with minimalist aesthetics and
                premium materials.
              </p>
            </div>

            {/* 2. Shop Section - 1 col on mobile */}
            <div className="col-span-1">
              <h5 className="font-bold uppercase tracking-wider mb-5 text-xs md:text-sm">
                Shop
              </h5>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <Link
                    href={AppRoutes.MEN}
                    className="hover:text-white transition-colors"
                  >
                    Men
                  </Link>
                </li>
                <li>
                  <Link
                    href={AppRoutes.WOMEN}
                    className="hover:text-white transition-colors"
                  >
                    Women
                  </Link>
                </li>
                <li>
                  <Link
                    href={AppRoutes.ACCESSORIES}
                    className="hover:text-white transition-colors"
                  >
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    href={AppRoutes.NEW_ARRIVALS}
                    className="hover:text-white transition-colors"
                  >
                    New Drops
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Help Section - 1 col on mobile (Sits next to Shop) */}
            <div className="col-span-1">
              <h5 className="font-bold uppercase tracking-wider mb-5 text-xs md:text-sm">
                Help
              </h5>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li>
                  <Link
                    href={AppRoutes.SHIPPING}
                    className="hover:text-white transition-colors"
                  >
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link
                    href={AppRoutes.FAQ}
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href={AppRoutes.CONTACT}
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href={AppRoutes.SIZE_GUIDE}
                    className="hover:text-white transition-colors"
                  >
                    Sizing
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. Newsletter - Full width on mobile */}
            <div className="col-span-2 md:col-span-1 space-y-4 pt-4 md:pt-0">
              <h5 className="font-bold uppercase tracking-wider text-xs md:text-sm">
                Newsletter
              </h5>
              <p className="text-neutral-400 text-sm">
                Exclusive drops and early access.
              </p>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="EMAIL ADDRESS"
                  className="bg-neutral-900 border-neutral-800 text-white rounded-none h-11 text-xs uppercase focus-visible:ring-white"
                />
                <Button className="bg-white text-black hover:bg-neutral-200 rounded-none h-11 font-bold uppercase text-xs w-full">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
            <div className="flex gap-8 order-1 md:order-2">
              <Link
                href={AppRoutes.PRIVACY}
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href={AppRoutes.TERMS}
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
            </div>
            <p className="order-2 md:order-1">
              © 2026 Street•Wear. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}

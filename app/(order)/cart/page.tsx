"use client";
import { Layout } from "@/components/ui/layout";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/common/button";
import { AppRoutes } from "@/types/enums";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Separator } from "@/components/common/separator";
import Link from "next/link";

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-3xl font-heading font-bold uppercase tracking-tight mb-4">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild className="uppercase tracking-widest rounded-none h-12 px-8">
                        <Link href={AppRoutes.HOME}>Start Shopping</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-heading font-bold uppercase tracking-tight mb-8">
                    Shopping Cart ({items.length})
                </h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-8">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-6 py-6 border-b">
                                <div className="w-24 h-32 bg-secondary flex-shrink-0">
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                            <p className="font-bold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">Size: {item.selectedSize}</p>
                                        <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center border border-neutral-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-neutral-100 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-neutral-100 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={() => clearCart()} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-secondary p-8 sticky top-24">
                            <h2 className="text-xl font-bold uppercase tracking-wide mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <Separator className="bg-black/10 mb-6" />

                            <div className="flex justify-between text-lg font-bold mb-8">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>

                            <Button asChild className="w-full h-14 text-base uppercase tracking-widest font-bold rounded-none">
                                <Link href={AppRoutes.CHECKOUT}>
                                    Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>

                            <div className="mt-6 text-xs text-center text-muted-foreground">
                                <p>Secure Checkout - SSL Encrypted</p>
                                <p className="mt-2">Free shipping on orders over $150</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

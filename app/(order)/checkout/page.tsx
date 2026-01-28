"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import * as api from "@/lib/api";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { RadioGroup, RadioGroupItem } from "@/components/common/radio-group";
import { Separator } from "@/components/common/separator";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppRoutes, PaymentMethod } from "@/types/enums";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/common/form";
import { Loader2 } from "lucide-react";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(4, "Valid ZIP code is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    setIsProcessing(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.images[0],
      }));

      await api.createOrder({
        ...values,
        items: orderItems,
        subtotal: cartTotal.toFixed(2),
        total: cartTotal.toFixed(2),
        paymentMethod: PaymentMethod.CARD,
      });

      await clearCart();
      router.push(AppRoutes.SUCCESS);
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }

  if (items.length === 0) {
    return (
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold uppercase mb-4">Your Cart is Empty</h1>
          <Button asChild variant="outline"><Link href={AppRoutes.HOME}>Start Shopping</Link></Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b py-4 px-6 md:px-12 flex justify-between items-center">
        <Link href={AppRoutes.HOME} className="text-xl font-heading font-bold tracking-tighter uppercase">
          Street<span className="text-muted-foreground">•</span>Wear
        </Link>
        <Link href={AppRoutes.CART} className="text-sm underline hover:text-muted-foreground">Back to Cart</Link>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Form */}
        <div className="p-6 md:p-12 lg:pr-24">
          <div className="w-full max-w-2xl mx-auto lg:mr-0 lg:ml-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Shipping Address</h2>

                <div className="grid grid-cols-1 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input className="h-12" placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input className="h-12" placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input className="h-12" placeholder="123 Street Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input className="h-12" placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input className="h-12" placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-6" />
                <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Contact Information</h2>

                <div className="grid grid-cols-1 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field } : any) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input className="h-12" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input className="h-12" placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-6" />
                <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Payment</h2>

                <RadioGroup defaultValue={PaymentMethod.CARD} className="grid gap-4">
                  <div className="flex items-center space-x-2 border p-4 rounded-sm">
                    <RadioGroupItem value={PaymentMethod.CARD} id="card" />
                    <Label htmlFor="card" className="font-medium">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-sm">
                    <RadioGroupItem value={PaymentMethod.PAYPAL} id="paypal" />
                    <Label htmlFor="paypal" className="font-medium">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-sm">
                    <RadioGroupItem value={PaymentMethod.COD} id="cod" />
                    <Label htmlFor="cod" className="font-medium">Cash on Delivery</Label>
                  </div>
                </RadioGroup>

                <Button
                  type="submit"
                  className="w-full h-14 text-base uppercase tracking-widest font-bold rounded-none mt-8"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    `Pay $${cartTotal.toFixed(2)}`
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-secondary p-6 md:p-12 lg:pl-24 border-t lg:border-t-0 lg:border-l">
          <div className="max-w-lg mx-auto lg:ml-0 lg:mr-auto">
            <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-white flex-shrink-0">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.selectedColor} / {item.selectedSize}</p>
                  </div>
                  <p className="text-sm font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="bg-black/10 mb-6" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at next step</span>
              </div>
            </div>

            <Separator className="bg-black/10 my-6" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

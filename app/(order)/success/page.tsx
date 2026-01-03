import { Button } from "@/components/common/button";
import { CheckCircle2 } from "lucide-react";
import { AppRoutes } from "@/types/enums";
import Link from "next/link";

export default function Success() {
  return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-24 h-24 text-green-500" />
        </div>
        <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-4">
          Order Confirmed
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
          Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="uppercase tracking-widest rounded-none h-12 px-8" asChild>
            <Link href={AppRoutes.HOME}>Continue Shopping</Link>
          </Button>
          <Button size="lg" variant="outline" className="uppercase tracking-widest rounded-none h-12 px-8" asChild>
            <Link href={AppRoutes.ACCOUNT}>View Order</Link>
          </Button>
        </div>
      </div>
  );
}

import { HeaderFooterLayout } from "@/components/ui/HeaderFooterLayout";
import { ReactNode } from "react";

export default function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <HeaderFooterLayout>
        {children}
    </HeaderFooterLayout>
  );
}

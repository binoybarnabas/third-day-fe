import { HeaderFooterLayout } from "@/components/ui/HeaderFooterLayout";
import { ReactNode } from "react";

export default function CartLayout({
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

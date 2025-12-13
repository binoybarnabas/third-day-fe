import { HeaderFooterLayout } from "@/components/ui/HeaderFooterLayout";
import { ReactNode } from "react";

export default function AccessoriesLayout({
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

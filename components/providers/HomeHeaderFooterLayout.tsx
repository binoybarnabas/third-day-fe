"use client";

import { usePathname } from "next/navigation";
import { HeaderFooterLayout } from "@/components/ui/HeaderFooterLayout";

export function HomeHeaderFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname !== "/") {
    return <>{children}</>;
  }

  return (
    <HeaderFooterLayout>
      {children}
    </HeaderFooterLayout>
  );
}

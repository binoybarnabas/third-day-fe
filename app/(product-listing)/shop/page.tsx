import ProductListing from "@/components/ui/product-listing";
import { AppRoutes } from "@/types/enums"; // Assuming you have this enum

export default function ShopPage() {
  return <ProductListing category={AppRoutes.SHOP} />;
}
import ProductListing from "@/components/ui/product-listing";
import { AppRoutes } from "@/types/enums"; // Assuming you have this enum

export default function AccessoriesPage() {
  return <ProductListing category={AppRoutes.ACCESSORIES} />;
}
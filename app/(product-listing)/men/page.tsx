import ProductListing from "@/components/ui/product-listing";
import { ProductGender } from "@/types/enums"; // Assuming you have this enum

export default function MenPage() {
  return <ProductListing category={ProductGender.MEN} />;
}
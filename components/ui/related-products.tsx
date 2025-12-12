import { useQuery } from "@tanstack/react-query";
import { ProductCategory } from "@/types/enums";
import * as api from "@/lib/api";
import { ProductCard } from "./product-card";
import { Skeleton } from "../common/skeleton";

interface RelatedProductsProps {
    currentProductId: number;
    category: ProductCategory;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: api.fetchProducts,
    });

    // Filter products: same category, exclude current product, limit to 4
    const relatedProducts = products
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, 4);

    if (relatedProducts.length === 0 && !isLoading) return null;

    return (
        <div className="mt-24">
            <h2 className="text-2xl font-heading font-bold uppercase tracking-tight mb-8 text-center">
                You May Also Like
            </h2>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[3/4] w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

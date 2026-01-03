import * as api from "@/lib/api";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import Link from "next/link";

interface ProductCardProps {
  product: api.Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  return (
    <div className="group relative">
      <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`
            absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all z-20
            ${isLiked ? "bg-black text-white opacity-100" : "bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-white"}
          `}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        </button>
        {product.newArrival && (
          <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
            New
          </span>
        )}
        {product.bestSeller && !product.newArrival && (
          <span className="absolute top-4 left-4 bg-white text-black border border-black text-xs font-bold px-2 py-1 uppercase tracking-wider">
            Best Seller
          </span>
        )}

      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              <Link href={`/product/${product.id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
          </div>
          <p className="text-sm font-medium text-foreground">
            ${parseFloat(product.price).toFixed(2)}
          </p>
        </div>
      </div>
    </div >
  );
}

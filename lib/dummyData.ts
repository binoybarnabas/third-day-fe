import { Product } from './api';
import { ProductCategory, ProductSubCategory, ProductGender, OrderStatus, ProductSize, AppRoutes } from '@/types/enums';
import heroImage from "@/attached_assets/generated_images/hero_banner_with_streetwear_models.png";
import menCatImage from "@/attached_assets/generated_images/men's_fashion_category_image.png";
import womenCatImage from "@/attached_assets/generated_images/women's_fashion_category_image.png";

// Dummy product data for streetwear clothing store
export const dummyProducts: Product[] = [
    // ============== MEN'S HOODIES ==============
    {
        id: 1,
        title: "Essential Oversized Hoodie",
        price: "89.99",
        originalPrice: "129.99",
        description: "Premium heavyweight cotton hoodie with dropped shoulders and oversized fit. Features ribbed cuffs and hem, kangaroo pocket, and minimalist branding. Perfect for layering or wearing solo.",
        category: ProductCategory.HOODIES,
        subCategory: ProductSubCategory.STREETWEAR,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL, ProductSize.XXL],
        colors: ["Black", "Grey", "Cream"],
        stock: 45,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 2,
        title: "Tech Fleece Zip Hoodie",
        price: "119.99",
        description: "Advanced tech fleece construction for superior warmth without bulk. Full-zip design with ergonomic hood and secure zip pockets. Modern athletic silhouette.",
        category: ProductCategory.HOODIES,
        subCategory: ProductSubCategory.PERFORMANCE,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "Navy", "Olive"],
        stock: 32,
        newArrival: true,
        bestSeller: false
    },
    {
        id: 3,
        title: "Vintage Washed Hoodie",
        price: "94.99",
        originalPrice: "110.00",
        description: "Garment-washed for a lived-in feel. Unique faded colorways with distressed details. Each piece is one-of-a-kind due to the washing process.",
        category: ProductCategory.HOODIES,
        subCategory: ProductSubCategory.VINTAGE,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Washed Black", "Faded Grey", "Rust"],
        stock: 18,
        newArrival: false,
        bestSeller: true
    },

    // ============== MEN'S T-SHIRTS ==============
    {
        id: 4,
        title: "Premium Cotton Tee",
        price: "39.99",
        description: "Heavyweight 100% organic cotton tee with reinforced shoulder seams. Boxy fit with dropped shoulders. Minimal branding for versatile styling.",
        category: ProductCategory.T_SHIRTS,
        subCategory: ProductSubCategory.BASICS,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL, ProductSize.XXL],
        colors: ["Black", "White", "Grey", "Cream", "Navy"],
        stock: 120,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 5,
        title: "Graphic Print Tee",
        price: "49.99",
        description: "Limited edition graphic tee featuring exclusive artist collaboration. Screen-printed on premium cotton with vintage-inspired artwork.",
        category: ProductCategory.T_SHIRTS,
        subCategory: ProductSubCategory.GRAPHICS,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "White"],
        stock: 25,
        newArrival: true,
        bestSeller: false
    },
    {
        id: 6,
        title: "Oversized Longline Tee",
        price: "54.99",
        description: "Extended length tee with exaggerated drop shoulders. Modern streetwear silhouette in premium cotton jersey. Perfect for layering.",
        category: ProductCategory.T_SHIRTS,
        subCategory: ProductSubCategory.STREETWEAR,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "Grey", "Olive"],
        stock: 38,
        newArrival: true,
        bestSeller: true
    },

    // ============== MEN'S PANTS ==============
    {
        id: 7,
        title: "Cargo Utility Pants",
        price: "129.99",
        description: "Multi-pocket cargo pants in durable ripstop fabric. Adjustable waist with drawstring, reinforced knees, and tapered leg opening. Military-inspired design.",
        category: ProductCategory.PANTS,
        subCategory: ProductSubCategory.CARGO,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.SIZE_28, ProductSize.SIZE_30, ProductSize.SIZE_32, ProductSize.SIZE_34, ProductSize.SIZE_36],
        colors: ["Black", "Olive", "Khaki"],
        stock: 42,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 8,
        title: "Tapered Joggers",
        price: "84.99",
        originalPrice: "99.99",
        description: "Premium fleece joggers with tapered fit. Elastic waistband with drawstring, side pockets, and ribbed ankle cuffs. Ultimate comfort meets style.",
        category: ProductCategory.PANTS,
        subCategory: ProductSubCategory.JOGGERS,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "Grey", "Navy"],
        stock: 55,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 9,
        title: "Wide Leg Denim",
        price: "149.99",
        description: "Relaxed wide-leg jeans in premium Japanese denim. High-rise fit with vintage wash. Constructed with reinforced stitching for durability.",
        category: ProductCategory.PANTS,
        subCategory: ProductSubCategory.DENIM,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.SIZE_28, ProductSize.SIZE_30, ProductSize.SIZE_32, ProductSize.SIZE_34, ProductSize.SIZE_36],
        colors: ["Indigo", "Black", "Light Wash"],
        stock: 28,
        newArrival: true,
        bestSeller: false
    },

    // ============== MEN'S JACKETS ==============
    {
        id: 10,
        title: "Puffer Jacket",
        price: "199.99",
        description: "Insulated puffer jacket with water-resistant shell. High-neck design with adjustable hood, multiple pockets, and elastic cuffs. Perfect for cold weather.",
        category: ProductCategory.JACKETS,
        subCategory: ProductSubCategory.OUTERWEAR,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "Navy", "Olive"],
        stock: 22,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 11,
        title: "Bomber Jacket",
        price: "179.99",
        originalPrice: "220.00",
        description: "Classic bomber silhouette in premium nylon. Ribbed collar, cuffs, and hem. Zip closure with side pockets. Lightweight yet durable.",
        category: ProductCategory.JACKETS,
        subCategory: ProductSubCategory.OUTERWEAR,
        gender: ProductGender.MEN,
        images: [
            "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "Sage", "Burgundy"],
        stock: 15,
        newArrival: false,
        bestSeller: false
    },

    // ============== WOMEN'S HOODIES ==============
    {
        id: 12,
        title: "Cropped Hoodie",
        price: "74.99",
        description: "Cropped length hoodie with relaxed fit. Soft fleece interior, drawstring hood, and ribbed hem. Perfect for high-waisted bottoms.",
        category: ProductCategory.HOODIES,
        subCategory: ProductSubCategory.STREETWEAR,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L],
        colors: ["Black", "Cream", "Pink", "Grey"],
        stock: 48,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 13,
        title: "Oversized Zip Hoodie",
        price: "99.99",
        description: "Oversized fit zip-up hoodie in premium cotton blend. Full-length zipper, kangaroo pockets, and adjustable hood. Effortlessly cool.",
        category: ProductCategory.HOODIES,
        subCategory: ProductSubCategory.STREETWEAR,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "Grey", "Lavender"],
        stock: 35,
        newArrival: true,
        bestSeller: false
    },

    // ============== WOMEN'S TOPS ==============
    {
        id: 14,
        title: "Fitted Crop Top",
        price: "34.99",
        description: "Ribbed crop top with fitted silhouette. Scoop neckline and short sleeves. Made from soft, stretchy cotton blend. Essential wardrobe staple.",
        category: ProductCategory.TOPS,
        subCategory: ProductSubCategory.BASICS,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L],
        colors: ["Black", "White", "Cream", "Brown"],
        stock: 85,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 15,
        title: "Graphic Baby Tee",
        price: "44.99",
        description: "Fitted baby tee with exclusive graphic print. Short sleeves and cropped length. Vintage-inspired design on soft cotton.",
        category: ProductCategory.TOPS,
        subCategory: ProductSubCategory.GRAPHICS,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L],
        colors: ["White", "Black", "Pink"],
        stock: 42,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 16,
        title: "Oversized Tee",
        price: "49.99",
        description: "Relaxed oversized tee with dropped shoulders. Heavyweight cotton construction. Perfect for effortless street style.",
        category: ProductCategory.TOPS,
        subCategory: ProductSubCategory.STREETWEAR,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L],
        colors: ["Black", "White", "Grey"],
        stock: 52,
        newArrival: false,
        bestSeller: false
    },

    // ============== WOMEN'S BOTTOMS ==============
    {
        id: 17,
        title: "High-Rise Cargo Pants",
        price: "119.99",
        description: "High-waisted cargo pants with utility pockets. Tapered leg with adjustable drawstring hem. Durable cotton twill construction.",
        category: ProductCategory.PANTS,
        subCategory: ProductSubCategory.CARGO,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.SIZE_24, ProductSize.SIZE_26, ProductSize.SIZE_28, ProductSize.SIZE_30, ProductSize.SIZE_32],
        colors: ["Black", "Khaki", "Olive"],
        stock: 38,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 18,
        title: "Wide Leg Trousers",
        price: "109.99",
        originalPrice: "139.99",
        description: "Elegant wide-leg trousers with pleated front. High-rise fit with side pockets. Sophisticated silhouette in premium fabric.",
        category: ProductCategory.PANTS,
        subCategory: ProductSubCategory.TROUSERS,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.SIZE_24, ProductSize.SIZE_26, ProductSize.SIZE_28, ProductSize.SIZE_30],
        colors: ["Black", "Cream", "Grey"],
        stock: 28,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 19,
        title: "Straight Leg Jeans",
        price: "129.99",
        description: "Classic straight-leg jeans in premium denim. Mid-rise fit with five-pocket styling. Versatile wash suitable for any occasion.",
        category: ProductCategory.PANTS,
        subCategory: ProductSubCategory.DENIM,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.SIZE_24, ProductSize.SIZE_26, ProductSize.SIZE_28, ProductSize.SIZE_30, ProductSize.SIZE_32],
        colors: ["Indigo", "Black", "Light Blue"],
        stock: 45,
        newArrival: true,
        bestSeller: false
    },

    // ============== WOMEN'S OUTERWEAR ==============
    {
        id: 20,
        title: "Puffer Vest",
        price: "139.99",
        description: "Sleeveless puffer vest with high collar. Water-resistant shell with insulated fill. Perfect layering piece for transitional weather.",
        category: ProductCategory.JACKETS,
        subCategory: ProductSubCategory.OUTERWEAR,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L],
        colors: ["Black", "Cream", "Brown"],
        stock: 25,
        newArrival: true,
        bestSeller: false
    },
    {
        id: 21,
        title: "Leather Jacket",
        price: "299.99",
        description: "Premium vegan leather jacket with asymmetric zip. Fitted silhouette with quilted shoulders. Edgy yet timeless design.",
        category: ProductCategory.JACKETS,
        subCategory: ProductSubCategory.OUTERWEAR,
        gender: ProductGender.WOMEN,
        images: [
            "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.XS, ProductSize.S, ProductSize.M, ProductSize.L],
        colors: ["Black", "Brown"],
        stock: 12,
        newArrival: false,
        bestSeller: true
    },

    // ============== ACCESSORIES - BAGS ==============
    {
        id: 22,
        title: "Canvas Tote Bag",
        price: "39.99",
        description: "Heavy-duty canvas tote with reinforced handles. Spacious interior with internal pocket. Minimalist design with subtle branding.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.BAGS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.ONE_SIZE],
        colors: ["Black", "Cream", "Olive"],
        stock: 65,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 23,
        title: "Crossbody Bag",
        price: "79.99",
        description: "Compact crossbody bag with adjustable strap. Multiple compartments for organization. Water-resistant nylon construction.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.BAGS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.ONE_SIZE],
        colors: ["Black", "Grey", "Navy"],
        stock: 42,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 24,
        title: "Backpack",
        price: "119.99",
        originalPrice: "149.99",
        description: "Minimalist backpack with laptop compartment. Padded shoulder straps and back panel. Durable water-resistant fabric.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.BAGS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.ONE_SIZE],
        colors: ["Black", "Grey"],
        stock: 35,
        newArrival: false,
        bestSeller: false
    },

    // ============== ACCESSORIES - HATS ==============
    {
        id: 25,
        title: "Beanie",
        price: "29.99",
        description: "Ribbed knit beanie in soft acrylic blend. Cuffed design with woven label. Essential cold-weather accessory.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.HATS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.ONE_SIZE],
        colors: ["Black", "Grey", "Cream", "Navy"],
        stock: 95,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 26,
        title: "Baseball Cap",
        price: "34.99",
        description: "Classic six-panel baseball cap with adjustable strap. Embroidered logo on front. Pre-curved brim.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.HATS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.ONE_SIZE],
        colors: ["Black", "White", "Navy", "Olive"],
        stock: 78,
        newArrival: true,
        bestSeller: true
    },
    {
        id: 27,
        title: "Bucket Hat",
        price: "39.99",
        description: "Reversible bucket hat in cotton twill. Wide brim for sun protection. Two looks in one versatile accessory.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.HATS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S_M, ProductSize.L_XL],
        colors: ["Black", "Khaki", "Denim"],
        stock: 52,
        newArrival: true,
        bestSeller: false
    },

    // ============== ACCESSORIES - OTHERS ==============
    {
        id: 28,
        title: "Leather Belt",
        price: "49.99",
        description: "Premium leather belt with metal buckle. Classic design suitable for casual or formal wear. Available in multiple sizes.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.BELTS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL],
        colors: ["Black", "Brown"],
        stock: 48,
        newArrival: false,
        bestSeller: true
    },
    {
        id: 29,
        title: "Sunglasses",
        price: "89.99",
        description: "Retro-inspired sunglasses with UV protection. Durable acetate frames with metal accents. Includes protective case.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.EYEWEAR,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.ONE_SIZE],
        colors: ["Black", "Tortoise", "Clear"],
        stock: 32,
        newArrival: true,
        bestSeller: false
    },
    {
        id: 30,
        title: "Socks Pack (3-Pack)",
        price: "24.99",
        description: "Three-pack of crew socks in premium cotton blend. Reinforced heel and toe. Comfortable ribbed cuffs.",
        category: ProductCategory.ACCESSORIES,
        subCategory: ProductSubCategory.SOCKS,
        gender: ProductGender.UNISEX,
        images: [
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        sizes: [ProductSize.S, ProductSize.M, ProductSize.L],
        colors: ["Black", "White", "Grey"],
        stock: 120,
        newArrival: false,
        bestSeller: true
    }
];

// Helper functions to filter products
export const getProductsByCategory = (category: ProductCategory): Product[] => {
    return dummyProducts.filter(p => p.category === category);
};

export const getProductsByGender = (gender: ProductGender): Product[] => {
    return dummyProducts.filter(p => p.gender === gender);
};

export const getFeaturedProducts = (): Product[] => {
    return dummyProducts.filter(p => p.bestSeller);
};

export const getNewArrivals = (): Product[] => {
    return dummyProducts.filter(p => p.newArrival);
};

export const getProductById = (id: number): Product | undefined => {
    return dummyProducts.find(p => p.id === id);
};

import { Order } from '@/types/dto';

export const dummyOrders: Order[] = [
    {
        id: 1001,
        email: "alex.doe@example.com",
        firstName: "Alex",
        lastName: "Doe",
        address: "123 Streetwear Blvd",
        city: "New York",
        zipCode: "10001",
        phone: "555-0123",
        items: [
            {
                productId: 1,
                title: "Essential Oversized Hoodie",
                price: "89.99",
                quantity: 1,
                selectedSize: "L",
                selectedColor: "Black",
                image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            {
                productId: 7,
                title: "Cargo Utility Pants",
                price: "129.99",
                quantity: 1,
                selectedSize: "32",
                selectedColor: "Black",
                image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800"
            }
        ],
        subtotal: "219.98",
        total: "219.98",
        status: OrderStatus.DELIVERED,
        paymentMethod: "Credit Card",
        createdAt: "2023-10-15T10:30:00Z"
    },
    {
        id: 1002,
        email: "sarah.smith@example.com",
        firstName: "Sarah",
        lastName: "Smith",
        address: "456 Fashion Ave",
        city: "Los Angeles",
        zipCode: "90001",
        phone: "555-0456",
        items: [
            {
                productId: 12,
                title: "Cropped Hoodie",
                price: "74.99",
                quantity: 2,
                selectedSize: "S",
                selectedColor: "Pink",
                image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800"
            }
        ],
        subtotal: "149.98",
        total: "149.98",
        status: OrderStatus.PROCESSING,
        paymentMethod: "PayPal",
        createdAt: "2023-10-20T14:15:00Z"
    },
    {
        id: 1003,
        email: "mike.jones@example.com",
        firstName: "Mike",
        lastName: "Jones",
        address: "789 Urban St",
        city: "Chicago",
        zipCode: "60601",
        phone: "555-0789",
        items: [
            {
                productId: 4,
                title: "Premium Cotton Tee",
                price: "39.99",
                quantity: 3,
                selectedSize: "XL",
                selectedColor: "White",
                image: "https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=800"
            }
        ],
        subtotal: "119.97",
        total: "119.97",
        status: OrderStatus.SHIPPED,
        paymentMethod: "Credit Card",
        createdAt: "2023-10-22T09:45:00Z"
    },
    {
        id: 1004,
        email: "emily.brown@example.com",
        firstName: "Emily",
        lastName: "Brown",
        address: "321 Style Rd",
        city: "Miami",
        zipCode: "33101",
        phone: "555-0321",
        items: [
            {
                productId: 22,
                title: "Canvas Tote Bag",
                price: "39.99",
                quantity: 1,
                selectedSize: "One Size",
                selectedColor: "Cream",
                image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800"
            },
            {
                productId: 25,
                title: "Beanie",
                price: "29.99",
                quantity: 1,
                selectedSize: "One Size",
                selectedColor: "Grey",
                image: "https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=800"
            }
        ],
        subtotal: "69.98",
        total: "69.98",
        status: OrderStatus.PENDING,
        paymentMethod: "Credit Card",
        createdAt: "2023-10-25T16:20:00Z"
    }
];

export const dummyVendors = [
  {
    id: 1,
    businessName: "TechNova Solutions",
    ownerName: "John Doe",
    email: "contact@technova.com",
    phone: "+1 234 567 890",
    address: "123 Silicon Valley, CA",
    status: "ACTIVE",
    productCount: 45,
    totalSales: 12450.50,
    commission: 12,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    businessName: "EcoLeaf Organics",
    ownerName: "Sarah Jenkins",
    email: "supply@ecoleaf.io",
    phone: "+1 415 888 2323",
    address: "782 Green St, Portland, OR 97201",
    status: "ACTIVE",
    productCount: 128,
    totalSales: 45200.00,
    commission: 10,
    createdAt: "2024-03-12T08:30:00Z"
  },
  {
    id: 3,
    businessName: "Midnight Apparel",
    ownerName: "Marcus Vane",
    email: "marcus@midnight.co",
    phone: "+1 212 555 0198",
    address: "440 Fashion Ave, New York, NY 10018",
    status: "PENDING",
    productCount: 12,
    totalSales: 0.00,
    commission: 15,
    createdAt: "2025-05-20T14:15:00Z"
  },
  {
    id: 4,
    businessName: "Apex Electronics",
    ownerName: "Chen Wei",
    email: "support@apexelectro.net",
    phone: "+1 310 444 9922",
    address: "900 Tech Hub Dr, Austin, TX 73301",
    status: "SUSPENDED",
    productCount: 310,
    totalSales: 89320.75,
    commission: 8,
    createdAt: "2023-11-05T11:45:00Z"
  }
];

export const HERO_SLIDES = [
  {
    image: heroImage,
    title: "Define Your Identity",
    description: "Curated streetwear for the modern generation. Minimalist aesthetics meets premium utility.",
    buttonLeft: { label: "Shop Men", link: AppRoutes.MEN },
    buttonRight: { label: "Shop Women", link: AppRoutes.WOMEN },
  },
  {
    image: menCatImage,
    title: "New Season Essentials",
    description: "Discover the latest drops designed for maximum comfort and unparalleled style.",
    buttonLeft: { label: "Explore New", link: AppRoutes.SHOP },
    buttonRight: { label: "Top Rated", link: AppRoutes.SHOP },
  },
  {
    image: womenCatImage,
    title: "Style Without Compromise",
    description: "High-performance fabrics combined with cutting-edge streetwear silhouettes.",
    buttonLeft: { label: "View All", link: AppRoutes.SHOP },
    buttonRight: { label: "Accessories", link: AppRoutes.ACCESSORIES },
  }
];

export const FIRST_ORDER_COUPON = {
  code: "IDENTITY15",
  discount: "15%",
  description: "Valid on your first purchase"
};
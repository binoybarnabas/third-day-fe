export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum ToastVariant {
    DEFAULT = 'default',
    DESTRUCTIVE = 'destructive',
}

export enum AppRoutes {
    HOME = '/',
    MEN = '/men',
    WOMEN = '/women',
    NEW_ARRIVALS = '/new-arrivals',
    ACCESSORIES = '/accessories',
    SHOP = '/shop',
    PRODUCT = '/product/:id',
    ACCOUNT = '/account',
    WISHLIST = '/wishlist',
    CART = '/cart',
    CHECKOUT = '/checkout',
    SUCCESS = '/success',
    SHIPPING = '/shipping',
    FAQ = '/faq',
    CONTACT = '/contact',
    SIZE_GUIDE = '/size-guide',
    PRIVACY = '/privacy',
    TERMS = '/terms',
    ADMIN_DASHBOARD = '/admin',
    ADMIN_PRODUCTS = '/admin/products',
    ADMIN_VENDORS = '/admin/vendors',
    ADMIN_ORDERS = '/admin/orders',
    ADMIN_CUSTOMERS = '/admin/customers',
    ADMIN_SETTINGS = '/admin/settings',
    LOGIN = '/login'
}

export enum ProductCategory {
    HOODIES = 'Hoodies',
    T_SHIRTS = 'T-Shirts',
    PANTS = 'Pants',
    JACKETS = 'Jackets',
    TOPS = 'Tops',
    ACCESSORIES = 'Accessories',
}

export enum ProductSubCategory {
    STREETWEAR = 'Streetwear',
    PERFORMANCE = 'Performance',
    VINTAGE = 'Vintage',
    BASICS = 'Basics',
    GRAPHICS = 'Graphics',
    CARGO = 'Cargo',
    JOGGERS = 'Joggers',
    DENIM = 'Denim',
    OUTERWEAR = 'Outerwear',
    BAGS = 'Bags',
    HATS = 'Hats',
    BELTS = 'Belts',
    EYEWEAR = 'Eyewear',
    SOCKS = 'Socks',
    TROUSERS = 'Trousers',
}

export enum ProductGender {
    MEN = 'Men',
    WOMEN = 'Women',
    UNISEX = 'Unisex',
}

export enum PaymentMethod {
    CARD = 'card',
    PAYPAL = 'paypal',
    COD = 'cod',
}

export enum SortOption {
    NEWEST = 'newest',
    PRICE_ASC = 'price-asc',
    PRICE_DESC = 'price-desc',
}

export enum ProductSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
    XXXL = 'XXXL',
    // Numeric sizes
    SIZE_24 = '24',
    SIZE_26 = '26',
    SIZE_28 = '28',
    SIZE_30 = '30',
    SIZE_32 = '32',
    SIZE_34 = '34',
    SIZE_36 = '36',
    // Other sizes
    ONE_SIZE = 'One Size',
    S_M = 'S/M',
    L_XL = 'L/XL',
}

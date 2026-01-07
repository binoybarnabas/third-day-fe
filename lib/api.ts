// API client for backend communication
import { CartData, Customer, Order, OrderItem, Stat } from '@/types/dto';
import { dummyProducts, getProductById as getDummyProductById, dummyOrders } from './dummyData';
import { ProductCategory, ProductSubCategory, ProductGender, OrderStatus, ProductSize, ProductStatus } from '@/types/enums';
import { get, post, put } from '@/utils/api';

export interface Product {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  description: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  gender: ProductGender;
  images: string[];
  sizes: ProductSize[];
  colors: string[];
  stock: number;
  newArrival: boolean;
  bestSeller: boolean;
  status?: ProductStatus;
}

export interface CartItem {
  id: number;
  userId?: string;
  sessionId?: string;
  productId: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  product: Product;
}



// Helper function to get sessionId
export function getSessionId(): string {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

// ============== PRODUCTS ==============
const PRODUCTS_STORAGE_KEY = 'streetwear_products';

function getStoredProducts(): Product[] {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(dummyProducts));
  return dummyProducts;
}

export async function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getStoredProducts()), 300);
  });
}

export async function fetchProduct(id: number): Promise<Product> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const product = products.find(p => p.id === id);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 300);
  });
}

export async function addProduct(product: Product): Promise<Product> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProducts();
      products.unshift(product);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      resolve(product);
    }, 300);
  });
}

export async function updateProduct(product: Product): Promise<Product> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        products[index] = product;
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      }
      resolve(product);
    }, 300);
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStoredProducts();
      const filtered = products.filter(p => p.id !== id);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
      resolve();
    }, 300);
  });
}

// ============== CART ==============
const CART_STORAGE_KEY = 'streetwear_cart';

export async function fetchCart(userId?: string): Promise<CartItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
      resolve(cart);
    }, 200);
  });
}

export async function addToCart(data: CartData): Promise<CartItem> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      let cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      // Check if item already exists
      const existingItemIndex = cart.findIndex(item =>
        item.productId === data.productId &&
        item.selectedSize === data.selectedSize &&
        item.selectedColor === data.selectedColor
      );

      let newItem: CartItem;

      if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += data.quantity;
        newItem = cart[existingItemIndex];
      } else {
        // Add new item
        const product = getDummyProductById(data.productId);
        if (!product) throw new Error("Product not found");

        newItem = {
          id: Date.now(), // Mock ID
          userId: data.userId,
          productId: data.productId,
          selectedSize: data.selectedSize,
          selectedColor: data.selectedColor,
          quantity: data.quantity,
          product: product
        };
        cart.push(newItem);
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      resolve(newItem);
    }, 200);
  });
}

export async function updateCartItem(id: number, quantity: number): Promise<CartItem> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      let cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex === -1) {
        reject(new Error("Item not found"));
        return;
      }

      cart[itemIndex].quantity = quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      resolve(cart[itemIndex]);
    }, 200);
  });
}

export async function removeFromCart(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      let cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

      cart = cart.filter(item => item.id !== id);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      resolve();
    }, 200);
  });
}

export async function clearCart(userId?: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(CART_STORAGE_KEY);
      resolve();
    }, 200);
  });
}

// ============== WISHLIST ==============
const WISHLIST_STORAGE_KEY = 'streetwear_wishlist';

export async function fetchWishlist(userId?: string): Promise<number[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const wishlist: number[] = storedWishlist ? JSON.parse(storedWishlist) : [];
      resolve(wishlist);
    }, 200);
  });
}

export async function addToWishlist(productId: number, userId?: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      let wishlist: number[] = storedWishlist ? JSON.parse(storedWishlist) : [];

      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      }
      resolve();
    }, 200);
  });
}

export async function removeFromWishlist(productId: number, userId?: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      let wishlist: number[] = storedWishlist ? JSON.parse(storedWishlist) : [];

      wishlist = wishlist.filter(id => id !== productId);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      resolve();
    }, 200);
  });
}

// ============== ORDERS ==============
const ORDERS_STORAGE_KEY = 'streetwear_orders';

// Initialize orders from localStorage or dummyData
function getStoredOrders(): Order[] {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with dummy data if empty
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(dummyOrders));
  return dummyOrders;
}

export async function createOrder(data: {
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  items: OrderItem[];
  subtotal: string;
  total: string;
  paymentMethod: string;
}): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.floor(Math.random() * 10000) + 2000, // Random ID
        ...data,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
      };

      const orders = getStoredOrders();
      orders.unshift(newOrder);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

      resolve(newOrder);
    }, 500);
  });
}

export async function fetchOrders(userId?: string): Promise<Order[]> {
    const url = userId ? `/orders?userId=${userId}` : '/orders';
    const res = await get<Order[]>(url);
    return res.data;
}

export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const res = await put<Order>(`/orders/${orderId}/status`, { status });
    return res.data;
}

// ============== ADMIN API ==============


export async function fetchAdminStats(): Promise<Stat> {
    const res = await get<Stat>('/admin/stats');
    return res.data;
}


export async function fetchAllOrders(): Promise<Order[]> {
    const res = await get<Order[]>('/admin/orders');
    return res.data;
}


export async function AdminFetchProducts(): Promise<Product[]> {
    const res = await get<Product[]>('/products');
    return res.data;
}

// ============== CUSTOMERS ==============

export async function fetchCustomers(): Promise<Customer[]> {
    const res = await get<Customer[]>('/admin/customers');
    return res.data;
}


// ============== VENDORS ==============

export async function fetchVendors(page = 1, limit = 10, search = "") {
  const res = await get<any>(`/vendors?page=${page}&limit=${limit}&search=${search}`);
  return res.data; 
}

export async function addVendor(data: any) {
  const res = await post<any>('/vendors', data);
  return res.data;
}

export async function updateVendor(id: number, data: any) {
  const res = await put<any>(`/vendors/${id}`, data);
  return res.data;
}

// ============== VENDOR DASHBOARD (Dummy Data) ==============

export interface VendorStats {
  totalRevenue: string;
  totalOrders: number;
  productsCount: number;
  todaySales: number;
}

export async function fetchVendorStats(): Promise<VendorStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalRevenue: "12,450",
        totalOrders: 145,
        productsCount: 24,
        todaySales: 3
      });
    }, 500);
  });
}

export async function fetchVendorOrders(limit = 5): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getStoredOrders();
      resolve(orders.slice(0, limit));
    }, 500);
  });
}

export async function fetchVendorProducts(): Promise<Product[]> {
    return fetchProducts();
}

export async function fetchVendorProduct(id: number): Promise<Product> {
    return fetchProduct(id);
}

export async function addVendorProduct(product: Product): Promise<Product> {
    return addProduct(product);
}

export async function updateVendorProduct(product: Product): Promise<Product> {
    return updateProduct(product);
}

export async function deleteVendorProduct(id: number): Promise<void> {
    return deleteProduct(id);
}

// ============== VENDOR PROFILE ==============

export interface VendorProfile {
  firstName: string;
  lastName: string;
  email: string;
  storeName: string;
  storeDescription: string;
  phone: string;
  address: string;
}

export async function fetchVendorProfile(): Promise<VendorProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        firstName: "John",
        lastName: "Vendor",
        email: "vendor@example.com",
        storeName: "StreetStyle Co.",
        storeDescription: "Premium streetwear for the modern generation.",
        phone: "+1 (555) 012-3456",
        address: "123 Commerce St, New York, NY"
      });
    }, 500);
  });
}

export async function updateVendorProfile(data: VendorProfile): Promise<VendorProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}

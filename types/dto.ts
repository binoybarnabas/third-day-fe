import { LucideIcon } from "lucide-react";

export type CartData = {
  productId: number;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  userId?: string;
};

import { OrderStatus } from './enums';

export { OrderStatus };

export type OrderItem = {
  productId: number;
  title: string;
  price: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
};

export type Order = {
  id: number;
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
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
};

export interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  change: string;
}

export interface Stat {
  totalRevenue: number;
  totalOrders: number;
  todayOrders: number;
}

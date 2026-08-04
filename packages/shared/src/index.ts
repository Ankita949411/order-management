export type ApiResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  message: string;
  details?: unknown;
  errors?: Record<string, string[]>;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export const OrderStatus = {
  ORDER_RECEIVED: 'ORDER_RECEIVED',
  PREPARING: 'PREPARING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type CreateOrderRequest = {
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
};

export type UpdateOrderStatusRequest = {
  status: OrderStatus;
};

export type Order = {
  id: string;
  customerId: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  subtotalCents: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string;
  itemName: string;
  itemDescription: string;
  itemPriceCents: number;
  quantity: number;
  lineTotalCents: number;
  createdAt: string;
};

export type OrderStatusHistory = {
  id: string;
  orderId: string;
  status: OrderStatus;
  changedAt: string;
};

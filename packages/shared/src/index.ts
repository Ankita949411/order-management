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

export type OrderStatus =
  | 'ORDER_RECEIVED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

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

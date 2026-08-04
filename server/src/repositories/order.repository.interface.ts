import type { OrderStatus } from '@order-management/shared';
import type { CreateOrderData } from './order.repository';

export type OrderWithDetails = {
  id: string;
  customerId: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  subtotalCents: number;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    name: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  };
  items: Array<{
    id: string;
    orderId: string;
    menuItemId: string;
    itemName: string;
    itemDescription: string;
    itemPriceCents: number;
    quantity: number;
    lineTotalCents: number;
    createdAt: Date;
  }>;
  statusHistory: Array<{
    id: string;
    orderId: string;
    status: OrderStatus;
    changedAt: Date;
  }>;
};

export interface OrderRepositoryPort {
  findById(id: string): Promise<OrderWithDetails | null>;
  create(data: CreateOrderData): Promise<OrderWithDetails>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderWithDetails>;
}

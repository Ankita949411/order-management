import { OrderStatus, Prisma } from '@prisma/client';
import type { CreateOrderData } from './order.repository';

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: {
      orderBy: {
        createdAt: 'asc';
      };
    };
    statusHistory: {
      orderBy: {
        changedAt: 'asc';
      };
    };
  };
}>;

export interface OrderRepositoryPort {
  findById(id: string): Promise<OrderWithDetails | null>;
  create(data: CreateOrderData): Promise<OrderWithDetails>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderWithDetails>;
}

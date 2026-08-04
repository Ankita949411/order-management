import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';
import { OrderStatus, type OrderStatus as OrderStatusType } from '@order-management/shared';
import { OrderRepositoryPort, OrderWithDetails } from './order.repository.interface';

type TransactionClient = Prisma.TransactionClient;

export type CreateOrderData = {
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  subtotalCents: number;
  items: Array<{
    menuItemId: string;
    itemName: string;
    itemDescription: string;
    itemPriceCents: number;
    quantity: number;
    lineTotalCents: number;
  }>;
};

export class OrderRepository implements OrderRepositoryPort {
  constructor(private readonly db: PrismaClient = prisma) {}

  findById(id: string) {
    return this.db.order.findUnique({
      where: { id },
      include: this.defaultInclude()
    });
  }

  create(data: CreateOrderData) {
    return this.db.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          name: data.customer.name,
          phone: data.customer.phone
        }
      });

      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          deliveryName: data.customer.name,
          deliveryPhone: data.customer.phone,
          deliveryAddress: data.customer.address,
          subtotalCents: data.subtotalCents,
          items: {
            create: data.items
          },
          statusHistory: {
            create: {
              status: OrderStatus.ORDER_RECEIVED
            }
          }
        }
      });

      const createdOrder = await this.findByIdWithClient(tx, order.id);

      if (!createdOrder) {
        throw new Error('Failed to read created order');
      }

      return createdOrder;
    });
  }

  async updateStatus(id: string, status: OrderStatusType) {
    return this.db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status }
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status
        }
      });

      const updatedOrder = await this.findByIdWithClient(tx, id);

      if (!updatedOrder) {
        throw new Error('Failed to read updated order');
      }

      return updatedOrder;
    });
  }

  private findByIdWithClient(db: TransactionClient, id: string): Promise<OrderWithDetails | null> {
    return db.order.findUnique({
      where: { id },
      include: this.defaultInclude()
    });
  }

  private defaultInclude() {
    return {
      customer: true,
      items: {
        orderBy: {
          createdAt: 'asc' as const
        }
      },
      statusHistory: {
        orderBy: {
          changedAt: 'asc' as const
        }
      }
    };
  }
}

import { OrderStatus } from '@order-management/shared';
import { AppError } from '../middleware/error-handler';
import { MenuRepository } from '../repositories/menu.repository';
import { MenuRepositoryPort } from '../repositories/menu.repository.interface';
import { OrderRepository } from '../repositories/order.repository';
import { OrderRepositoryPort } from '../repositories/order.repository.interface';
import { CreateOrderInput } from '../schemas/order.schema';
import { orderRealtimeService, OrderRealtimePort } from './order-realtime.service';
import {
  orderStatusSchedulerService,
  OrderStatusSchedulerPort
} from './order-status-scheduler.service';

const allowedStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.ORDER_RECEIVED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
  [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: []
};

const terminalStatuses = new Set<OrderStatus>([OrderStatus.CANCELLED, OrderStatus.DELIVERED]);

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryPort = new OrderRepository(),
    private readonly menuRepository: MenuRepositoryPort = new MenuRepository(),
    private readonly realtimeService: OrderRealtimePort = orderRealtimeService,
    private readonly statusScheduler: OrderStatusSchedulerPort = orderStatusSchedulerService
  ) {}

  async createOrder(input: CreateOrderInput) {
    const mergedItems = input.items.reduce<Map<string, number>>((itemsByMenuId, item) => {
      itemsByMenuId.set(item.menuItemId, (itemsByMenuId.get(item.menuItemId) ?? 0) + item.quantity);
      return itemsByMenuId;
    }, new Map<string, number>());
    const requestedMenuIds = [...mergedItems.keys()];
    const menuItems = await this.menuRepository.findAvailableByIds(requestedMenuIds);
    const menuItemById = new Map(menuItems.map((item) => [item.id, item]));

    const missingMenuIds = requestedMenuIds.filter((id) => !menuItemById.has(id));

    if (missingMenuIds.length > 0) {
      throw new AppError(400, 'One or more menu items are invalid or unavailable', {
        menuItemIds: missingMenuIds
      });
    }

    const orderItems = [...mergedItems.entries()].map(([menuItemId, quantity]) => {
      const menuItem = menuItemById.get(menuItemId);

      if (!menuItem) {
        throw new AppError(400, 'Menu item not found');
      }

      return {
        menuItemId: menuItem.id,
        itemName: menuItem.name,
        itemDescription: menuItem.description,
        itemPriceCents: menuItem.priceCents,
        quantity,
        lineTotalCents: menuItem.priceCents * quantity
      };
    });

    const subtotalCents = orderItems.reduce((total, item) => total + item.lineTotalCents, 0);

    const order = await this.orderRepository.create({
      customer: input.customer,
      subtotalCents,
      items: orderItems
    });

    this.realtimeService.emitStatusUpdated({
      orderId: order.id,
      status: order.status,
      updatedAt: order.updatedAt.toISOString()
    });
    this.statusScheduler.start(order.id);

    return order;
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError(404, 'Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, nextStatus: OrderStatus) {
    const order = await this.getOrderById(id);
    const allowedNextStatuses = allowedStatusTransitions[order.status];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new AppError(409, `Cannot transition order from ${order.status} to ${nextStatus}`);
    }

    const updatedOrder = await this.orderRepository.updateStatus(id, nextStatus);

    if (!updatedOrder) {
      throw new AppError(404, 'Order not found');
    }

    this.realtimeService.emitStatusUpdated({
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      updatedAt: updatedOrder.updatedAt.toISOString()
    });

    if (terminalStatuses.has(updatedOrder.status)) {
      this.statusScheduler.stop(updatedOrder.id);
    }

    return updatedOrder;
  }
}

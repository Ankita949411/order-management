import { OrderStatus } from '@order-management/shared';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { OrderRepository } from '../repositories/order.repository';
import { OrderRepositoryPort } from '../repositories/order.repository.interface';
import { orderRealtimeService, OrderRealtimeService } from './order-realtime.service';

const simulatedStatusTransitions: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.ORDER_RECEIVED]: OrderStatus.PREPARING,
  [OrderStatus.PREPARING]: OrderStatus.OUT_FOR_DELIVERY,
  [OrderStatus.OUT_FOR_DELIVERY]: OrderStatus.DELIVERED
};

export class OrderStatusSchedulerService {
  private readonly timers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly orderRepository: OrderRepositoryPort = new OrderRepository(),
    private readonly realtimeService: OrderRealtimeService = orderRealtimeService,
    private readonly intervalMs = env.ORDER_STATUS_UPDATE_INTERVAL_MS
  ) {}

  start(orderId: string) {
    if (this.timers.has(orderId)) {
      return;
    }

    const timer = setInterval(() => {
      void this.advanceOrder(orderId).then((didAdvance) => {
        if (!didAdvance) {
          this.stop(orderId);
        }
      });
    }, this.intervalMs);
    timer.unref();

    this.timers.set(orderId, timer);
  }

  stop(orderId: string) {
    const timer = this.timers.get(orderId);

    if (!timer) {
      return;
    }

    clearInterval(timer);
    this.timers.delete(orderId);
  }

  stopAll() {
    for (const orderId of this.timers.keys()) {
      this.stop(orderId);
    }
  }

  private async advanceOrder(orderId: string) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return false;
    }

    const nextStatus = simulatedStatusTransitions[order.status];

    if (!nextStatus) {
      return false;
    }

    try {
      const updatedOrder = await this.orderRepository.updateStatus(orderId, nextStatus);

      this.realtimeService.emitStatusUpdated({
        orderId,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt.toISOString()
      });

      return true;
    } catch (error) {
      logger.error({ error, orderId, nextStatus }, 'Failed to simulate order status update');
      return false;
    }
  }
}

export const orderStatusSchedulerService = new OrderStatusSchedulerService();

export interface OrderStatusSchedulerPort {
  start(orderId: string): void;
  stop(orderId: string): void;
}

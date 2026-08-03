import { OrderStatus } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { logger } from '../config/logger';

const orderSubscriptionSchema = z.object({
  orderId: z.string().uuid()
});

export type OrderStatusUpdatedEvent = {
  orderId: string;
  status: OrderStatus;
  updatedAt: string;
};

export interface OrderRealtimePort {
  emitStatusUpdated(event: OrderStatusUpdatedEvent): void;
}

export class OrderRealtimeService implements OrderRealtimePort {
  private io?: Server;

  attach(io: Server) {
    this.io = io;
  }

  registerSocket(socket: Socket) {
    socket.on('order:subscribe', (payload: unknown) => {
      const result = orderSubscriptionSchema.safeParse(payload);

      if (!result.success) {
        socket.emit('order:error', {
          message: 'Invalid order subscription payload'
        });
        return;
      }

      // Assessment scope: clients subscribe by order ID only.
      // Production systems should authenticate the socket and verify that the
      // connected user owns this order before joining the order-specific room.
      socket.join(this.getOrderRoom(result.data.orderId));
      socket.emit('order:subscribed', {
        orderId: result.data.orderId
      });
    });

    socket.on('order:unsubscribe', (payload: unknown) => {
      const result = orderSubscriptionSchema.safeParse(payload);

      if (!result.success) {
        return;
      }

      socket.leave(this.getOrderRoom(result.data.orderId));
    });
  }

  emitStatusUpdated(event: OrderStatusUpdatedEvent) {
    if (!this.io) {
      logger.warn({ orderId: event.orderId }, 'Socket server not attached; status event skipped');
      return;
    }

    this.io.to(this.getOrderRoom(event.orderId)).emit('order:status-updated', event);
  }

  private getOrderRoom(orderId: string) {
    // Room names are intentionally scoped per order so updates are not broadcast
    // to every connected client. This is not an authorization mechanism by itself.
    return `order:${orderId}`;
  }
}

export const orderRealtimeService = new OrderRealtimeService();

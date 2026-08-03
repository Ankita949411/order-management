import type { OrderStatus } from '@order-management/shared';

export const orderStatusSteps: OrderStatus[] = [
  'ORDER_RECEIVED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  ORDER_RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const orderStatusColors: Record<
  OrderStatus,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  ORDER_RECEIVED: 'info',
  PREPARING: 'warning',
  OUT_FOR_DELIVERY: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error'
};

export function getActiveStatusIndex(status: OrderStatus) {
  if (status === 'CANCELLED') {
    return -1;
  }

  return orderStatusSteps.indexOf(status);
}

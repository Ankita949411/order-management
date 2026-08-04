import { useEffect, useMemo } from 'react';
import type { Order, OrderStatus, OrderStatusHistory } from '@order-management/shared';
import { useOrder } from '../../../hooks/useOrder';
import { useOrderTracking } from '../../../hooks/useOrderTracking';

export function useTrackedOrder(orderId?: string) {
  const { data: order, setData: setOrder, isLoading, error, refetch } = useOrder(orderId);
  const { status: realtimeStatus, lastUpdatedAt, isConnected } = useOrderTracking(orderId, {
    onReconnect: refetch
  });

  useEffect(() => {
    if (!realtimeStatus || !lastUpdatedAt) {
      return;
    }

    setOrder((currentOrder: Order | null) => {
      if (!currentOrder) {
        return currentOrder;
      }

      const alreadyHasStatus = currentOrder.statusHistory.some(
        (entry: OrderStatusHistory) => entry.status === realtimeStatus
      );

      return {
        ...currentOrder,
        status: realtimeStatus,
        updatedAt: lastUpdatedAt,
        statusHistory: alreadyHasStatus
          ? currentOrder.statusHistory
          : [
              ...currentOrder.statusHistory,
              {
                id: `${currentOrder.id}-${realtimeStatus}`,
                orderId: currentOrder.id,
                status: realtimeStatus,
                changedAt: lastUpdatedAt
              }
            ]
      };
    });
  }, [lastUpdatedAt, realtimeStatus, setOrder]);

  const statusTimestamps = useMemo(() => {
    const timestamps: Partial<Record<OrderStatus, string>> = {};

    for (const entry of order?.statusHistory ?? []) {
      timestamps[entry.status] = entry.changedAt;
    }

    return timestamps;
  }, [order?.statusHistory]);

  return {
    order,
    isLoading,
    error,
    isConnected,
    statusTimestamps
  };
}

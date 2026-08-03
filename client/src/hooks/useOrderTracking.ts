import { useEffect, useState } from 'react';
import { socketClient } from '../api/socketClient';
import type { OrderStatus } from '@order-management/shared';

type OrderStatusUpdatedEvent = {
  orderId: string;
  status: OrderStatus;
  updatedAt: string;
};

type UseOrderTrackingOptions = {
  onReconnect?: () => void;
};

export function useOrderTracking(orderId?: string, options: UseOrderTrackingOptions = {}) {
  const { onReconnect } = options;
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(socketClient.connected);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    function handleConnect() {
      setIsConnected(true);
      socketClient.emit('order:subscribe', { orderId });
      onReconnect?.();
    }

    function handleDisconnect() {
      setIsConnected(false);
    }

    function handleStatusUpdated(event: OrderStatusUpdatedEvent) {
      if (event.orderId !== orderId) {
        return;
      }

      setStatus(event.status);
      setLastUpdatedAt(event.updatedAt);
    }

    socketClient.on('connect', handleConnect);
    socketClient.on('disconnect', handleDisconnect);
    socketClient.on('order:status-updated', handleStatusUpdated);

    if (!socketClient.connected) {
      socketClient.connect();
    } else {
      handleConnect();
    }

    return () => {
      socketClient.emit('order:unsubscribe', { orderId });
      socketClient.off('connect', handleConnect);
      socketClient.off('disconnect', handleDisconnect);
      socketClient.off('order:status-updated', handleStatusUpdated);
    };
  }, [orderId, onReconnect]);

  return {
    status,
    lastUpdatedAt,
    isConnected
  };
}

import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../api/apiError';
import { getOrderById } from '../api/orderApi';
import type { Order } from '@order-management/shared';

export function useOrder(orderId?: string) {
  const [data, setData] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderId));
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setError('Order id is missing');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setData(await getOrderById(orderId));
    } catch (error) {
      setError(getApiErrorMessage(error, 'Unable to load order'));
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  return {
    data,
    setData,
    isLoading,
    error,
    refetch: loadOrder
  };
}

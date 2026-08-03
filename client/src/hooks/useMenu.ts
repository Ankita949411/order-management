import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../api/apiError';
import { getMenu } from '../api/menuApi';
import type { MenuItem } from '@order-management/shared';

export function useMenu() {
  const [data, setData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenu = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setData(await getMenu());
    } catch (error) {
      setError(getApiErrorMessage(error, 'Unable to load menu'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  return {
    data,
    isLoading,
    error,
    refetch: loadMenu
  };
}

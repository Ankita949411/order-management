import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@order-management/shared';

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const firstFieldError = data?.errors ? Object.values(data.errors).flat()[0] : undefined;

    return firstFieldError ?? data?.message ?? fallbackMessage;
  }

  return fallbackMessage;
}

import type {
  ApiResponse,
  CreateOrderRequest,
  Order,
  UpdateOrderStatusRequest
} from '@order-management/shared';
import { httpClient } from './httpClient';

export async function createOrder(payload: CreateOrderRequest) {
  const response = await httpClient.post<ApiResponse<Order>>('/orders', payload);
  return response.data.data;
}

export async function getOrderById(orderId: string) {
  const response = await httpClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
}

export async function updateOrderStatus(orderId: string, payload: UpdateOrderStatusRequest) {
  const response = await httpClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, payload);
  return response.data.data;
}

import type { ApiResponse, MenuItem } from '@order-management/shared';
import { httpClient } from './httpClient';

export async function getMenu() {
  const response = await httpClient.get<ApiResponse<MenuItem[]>>('/menu');
  return response.data.data;
}

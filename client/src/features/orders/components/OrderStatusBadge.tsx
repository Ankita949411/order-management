import { Chip } from '@mui/material';
import type { OrderStatus } from '@order-management/shared';
import { orderStatusColors, orderStatusLabels } from '../utils/orderStatus';

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Chip label={orderStatusLabels[status]} color={orderStatusColors[status]} />;
}

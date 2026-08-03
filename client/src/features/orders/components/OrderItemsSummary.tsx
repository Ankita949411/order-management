import { Divider, Stack, Typography } from '@mui/material';
import type { OrderItem } from '@order-management/shared';
import { formatCurrency } from '../../../utils/formatCurrency';

type OrderItemsSummaryProps = {
  items: OrderItem[];
  subtotalCents: number;
};

export function OrderItemsSummary({ items, subtotalCents }: OrderItemsSummaryProps) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">Items</Typography>
      {items.map((item) => (
        <Stack key={item.id} direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Typography color="text.secondary">
            {item.itemName} x {item.quantity}
          </Typography>
          <Typography>{formatCurrency(item.lineTotalCents)}</Typography>
        </Stack>
      ))}
      <Divider />
      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Typography sx={{ fontWeight: 700 }}>Total</Typography>
        <Typography sx={{ fontWeight: 700 }}>{formatCurrency(subtotalCents)}</Typography>
      </Stack>
    </Stack>
  );
}

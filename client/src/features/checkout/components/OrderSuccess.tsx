import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Button, Paper, Stack, Typography } from '@mui/material';
import type { Order } from '@order-management/shared';
import { Link as RouterLink } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';

type OrderSuccessProps = {
  order: Order;
};

export function OrderSuccess({ order }: OrderSuccessProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
        <Typography variant="h4" component="h1">
          Order Placed
        </Typography>
        <Typography color="text.secondary">
          Your order has been received and tracking is now active.
        </Typography>
        <Typography>
          Order ID: <strong>{order.id}</strong>
        </Typography>
        <Typography>
          Total: <strong>{formatCurrency(order.subtotalCents)}</strong>
        </Typography>
        <Button
          component={RouterLink}
          to={`/orders/${order.id}`}
          variant="contained"
          startIcon={<ReceiptLongIcon />}
        >
          Track Order
        </Button>
      </Stack>
    </Paper>
  );
}

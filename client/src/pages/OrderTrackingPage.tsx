import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Alert, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { OrderItemsSummary } from '../features/orders/components/OrderItemsSummary';
import { OrderStatusBadge } from '../features/orders/components/OrderStatusBadge';
import { OrderTimeline } from '../features/orders/components/OrderTimeline';
import { useTrackedOrder } from '../features/orders/hooks/useTrackedOrder';

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, isLoading, error, isConnected, statusTimestamps } = useTrackedOrder(orderId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!order) {
    return <ErrorState message="Order not found" />;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">
          Order Tracking
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Order ID: {order.id}
        </Typography>
      </Box>

      <Alert
        severity={isConnected ? 'success' : 'warning'}
        icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
      >
        {isConnected
          ? 'Realtime tracking is connected.'
          : 'Realtime tracking is reconnecting. The latest saved status is shown.'}
      </Alert>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ justifyContent: 'space-between', gap: 2 }}
          >
            <Box>
              <Typography variant="h6">Current Status</Typography>
              <Typography color="text.secondary">
                Last updated {new Date(order.updatedAt).toLocaleString()}
              </Typography>
            </Box>
            <OrderStatusBadge status={order.status} />
          </Stack>

          <Divider />

          <OrderTimeline currentStatus={order.status} updatedStatuses={statusTimestamps} />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h6">Delivery</Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip label={order.deliveryName} />
            <Chip label={order.deliveryPhone} variant="outlined" />
          </Stack>
          <Typography color="text.secondary">{order.deliveryAddress}</Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <OrderItemsSummary items={order.items} subtotalCents={order.subtotalCents} />
      </Paper>
    </Stack>
  );
}

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, Stack, Typography } from '@mui/material';
import type { OrderStatus } from '@order-management/shared';
import {
  getActiveStatusIndex,
  orderStatusLabels,
  orderStatusSteps
} from '../utils/orderStatus';

type OrderTimelineProps = {
  currentStatus: OrderStatus;
  updatedStatuses: Partial<Record<OrderStatus, string>>;
};

export function OrderTimeline({ currentStatus, updatedStatuses }: OrderTimelineProps) {
  const activeIndex = getActiveStatusIndex(currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <Box sx={{ borderLeft: '3px solid', borderColor: 'error.main', pl: 2, py: 1 }}>
        <Typography variant="subtitle1" color="error" sx={{ fontWeight: 700 }}>
          {orderStatusLabels.CANCELLED}
        </Typography>
        <Typography color="text.secondary">This order has been cancelled.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {orderStatusSteps.map((status, index) => {
        const isComplete = index <= activeIndex;
        const timestamp = updatedStatuses[status];

        return (
          <Stack
            key={status}
            direction="row"
            sx={{ gap: 1.5, alignItems: 'flex-start' }}
          >
            {isComplete ? (
              <CheckCircleIcon color="success" />
            ) : (
              <RadioButtonUncheckedIcon color="disabled" />
            )}
            <Box>
              <Typography sx={{ fontWeight: isComplete ? 700 : 400 }}>
                {orderStatusLabels[status]}
              </Typography>
              {timestamp ? (
                <Typography variant="body2" color="text.secondary">
                  {new Date(timestamp).toLocaleString()}
                </Typography>
              ) : null}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}

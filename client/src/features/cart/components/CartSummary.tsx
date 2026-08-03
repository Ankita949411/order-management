import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';

type CartSummaryProps = {
  subtotalCents: number;
  totalQuantity: number;
  disabled?: boolean;
};

export function CartSummary({ subtotalCents, totalQuantity, disabled = false }: CartSummaryProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, position: { md: 'sticky' }, top: { md: 88 } }}>
      <Stack spacing={2}>
        <Typography variant="h6">Order Summary</Typography>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Items</Typography>
          <Typography>{totalQuantity}</Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography>{formatCurrency(subtotalCents)}</Typography>
        </Stack>
        <Divider />
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700 }}>Total</Typography>
          <Typography sx={{ fontWeight: 700 }}>{formatCurrency(subtotalCents)}</Typography>
        </Stack>
        <Button
          component={RouterLink}
          to="/checkout"
          variant="contained"
          startIcon={<ShoppingBagIcon />}
          disabled={disabled}
        >
          Continue
        </Button>
      </Stack>
    </Paper>
  );
}

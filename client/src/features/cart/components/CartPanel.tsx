import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { CartItem } from '../../../types/cart';
import { EmptyState } from '../../../components/common/EmptyState';
import { CartItemRow } from './CartItemRow';

type CartPanelProps = {
  items: CartItem[];
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
  onClear: () => void;
};

export function CartPanel({ items, onUpdateQuantity, onRemove, onClear }: CartPanelProps) {
  if (items.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <EmptyState title="Your cart is empty" description="Add items from the menu to get started." />
        <Button component={RouterLink} to="/menu" variant="contained" startIcon={<RestaurantMenuIcon />}>
          Browse Menu
        </Button>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" component="h1">
          Shopping Cart
        </Typography>
        <Button color="error" startIcon={<DeleteSweepIcon />} onClick={onClear}>
          Empty Cart
        </Button>
      </Stack>

      <Stack sx={{ mt: 1 }}>
        {items.map((item) => (
          <CartItemRow
            key={item.menuItem.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </Stack>
    </Paper>
  );
}

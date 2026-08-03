import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import type { CartItem } from '../../../types/cart';
import { formatCurrency } from '../../../utils/formatCurrency';

type CartItemRowProps = {
  item: CartItem;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
};

const minQuantity = 1;
const maxQuantity = 99;

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const { menuItem, quantity } = item;
  const lineTotalCents = menuItem.priceCents * quantity;

  function handleQuantityChange(nextQuantity: number) {
    const normalizedQuantity = Math.min(Math.max(nextQuantity, minQuantity), maxQuantity);
    onUpdateQuantity(menuItem.id, normalizedQuantity);
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '72px 1fr', sm: '88px 1fr auto' },
        gap: 2,
        alignItems: 'center',
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box
        component="img"
        src={menuItem.imageUrl}
        alt={menuItem.name}
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          borderRadius: 1
        }}
      />

      <Stack spacing={1}>
        <Box>
          <Typography variant="subtitle1" component="h2">
            {menuItem.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(menuItem.priceCents)} each
          </Typography>
        </Box>

        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Tooltip title="Decrease quantity">
            <span>
              <IconButton
                aria-label={`Decrease ${menuItem.name} quantity`}
                size="small"
                disabled={quantity <= minQuantity}
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <TextField
            aria-label={`${menuItem.name} quantity`}
            type="number"
            size="small"
            value={quantity}
            slotProps={{
              htmlInput: {
                min: minQuantity,
                max: maxQuantity
              }
            }}
            onChange={(event) => handleQuantityChange(Number(event.target.value))}
            sx={{ width: 76 }}
          />
          <Tooltip title="Increase quantity">
            <IconButton
              aria-label={`Increase ${menuItem.name} quantity`}
              size="small"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove item">
            <IconButton
              aria-label={`Remove ${menuItem.name}`}
              color="error"
              size="small"
              onClick={() => onRemove(menuItem.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Typography
        variant="subtitle1"
        sx={{ gridColumn: { xs: '2', sm: 'auto' }, justifySelf: { sm: 'end' }, fontWeight: 700 }}
      >
        {formatCurrency(lineTotalCents)}
      </Typography>
    </Box>
  );
}

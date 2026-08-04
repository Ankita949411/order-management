import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { MenuItem } from '@order-management/shared';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { formatCurrency } from '../../../utils/formatCurrency';

type MenuItemCardProps = {
  item: MenuItem;
  quantity: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
};

export function MenuItemCard({
  item,
  quantity,
  onAddToCart,
  onUpdateQuantity
}: MenuItemCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <CardMedia
        component="img"
        image={item.imageUrl}
        alt={item.name}
        sx={{
          aspectRatio: '16 / 10',
          objectFit: 'cover'
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}
        >
          <Typography variant="h6" component="h2">
            {item.name}
          </Typography>
          <Chip label={formatCurrency(item.priceCents)} color="primary" size="small" />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {item.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        {quantity > 0 ? (
          <Stack
            direction="row"
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              px: 1,
              py: 0.5
            }}
          >
            <IconButton
              aria-label={`Decrease ${item.name} quantity`}
              color="primary"
              onClick={() => onUpdateQuantity(item.id, quantity - 1)}
            >
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 700 }}>{quantity}</Typography>
            <IconButton
              aria-label={`Increase ${item.name} quantity`}
              color="primary"
              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

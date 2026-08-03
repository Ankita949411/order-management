import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import type { MenuItem } from '@order-management/shared';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography
} from '@mui/material';
import { formatCurrency } from '../../../utils/formatCurrency';

type MenuItemCardProps = {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
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
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAddToCart(item)}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

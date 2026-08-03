import { Box, Grid, Stack, Typography } from '@mui/material';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { MenuItemCard } from '../features/menu/components/MenuItemCard';
import { useCart } from '../hooks/useCart';
import { useMenu } from '../hooks/useMenu';

export function MenuPage() {
  const { data: menuItems, error, isLoading } = useMenu();
  const { addItem } = useCart();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">
          Menu
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Choose your favorite items and add them to your cart.
        </Typography>
      </Box>

      {menuItems.length === 0 ? (
        <EmptyState title="No menu items available" description="Please check back soon." />
      ) : (
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <MenuItemCard item={item} onAddToCart={addItem} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}

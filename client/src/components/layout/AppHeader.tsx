import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppBar, Badge, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export function AppHeader() {
  const { totalQuantity } = useCart();

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <IconButton component={RouterLink} to="/menu" aria-label="Menu" color="inherit">
          <RestaurantMenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ ml: 1, flexGrow: 1 }}>
          Order Management
        </Typography>
        <Box>
          <IconButton component={RouterLink} to="/checkout" aria-label="Cart" color="inherit">
            <Badge badgeContent={totalQuantity} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

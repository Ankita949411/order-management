import { CssBaseline, ThemeProvider } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { CartProvider } from '../../context/CartContext';
import { theme } from '../../theme/theme';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}

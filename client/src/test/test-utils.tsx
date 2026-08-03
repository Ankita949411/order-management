import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { theme } from '../theme/theme';

export function renderWithProviders(ui: ReactElement, initialEntries = ['/']) {
  return render(
    <ThemeProvider theme={theme}>
      <CartProvider>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

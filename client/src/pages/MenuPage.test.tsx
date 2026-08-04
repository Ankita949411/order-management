import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as menuApi from '../api/menuApi';
import { AppHeader } from '../components/layout/AppHeader';
import { renderWithProviders } from '../test/test-utils';
import { MenuPage } from './MenuPage';

const menuItem = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Margherita Pizza',
  description: 'Classic pizza',
  priceCents: 899,
  imageUrl: 'https://example.com/pizza.jpg',
  isAvailable: true,
  createdAt: '2026-08-03T08:00:00.000Z',
  updatedAt: '2026-08-03T08:00:00.000Z'
};

describe('MenuPage', () => {
  beforeEach(() => {
    vi.spyOn(menuApi, 'getMenu').mockResolvedValue([menuItem]);
  });

  it('renders menu items and adds an item to the cart', async () => {
    renderWithProviders(
      <>
        <AppHeader />
        <MenuPage />
      </>,
      ['/menu']
    );

    expect(await screen.findByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('Classic pizza')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /increase margherita pizza quantity/i }));
    expect(screen.getByText('2')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /decrease margherita pizza quantity/i }));
    expect(screen.getByText('1')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /decrease margherita pizza quantity/i }));
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
});

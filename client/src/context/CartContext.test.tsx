import type { MenuItem } from '@order-management/shared';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../test/test-utils';
import { useCart } from '../hooks/useCart';

const item: MenuItem = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Margherita Pizza',
  description: 'Classic pizza',
  priceCents: 899,
  imageUrl: 'https://example.com/pizza.jpg',
  isAvailable: true,
  createdAt: '2026-08-03T08:00:00.000Z',
  updatedAt: '2026-08-03T08:00:00.000Z'
};

function CartHarness() {
  const { addItem, clearCart, removeItem, subtotalCents, totalQuantity, updateQuantity } = useCart();

  return (
    <div>
      <p>Quantity: {totalQuantity}</p>
      <p>Subtotal: {subtotalCents}</p>
      <button onClick={() => addItem(item)}>Add</button>
      <button onClick={() => updateQuantity(item.id, 3)}>Set 3</button>
      <button onClick={() => removeItem(item.id)}>Remove</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}

describe('CartContext', () => {
  it('adds, updates, removes, and clears cart items', async () => {
    renderWithProviders(<CartHarness />);

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: 899')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Set 3' }));
    expect(screen.getByText('Quantity: 3')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: 2697')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(screen.getByText('Quantity: 0')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
  });
});

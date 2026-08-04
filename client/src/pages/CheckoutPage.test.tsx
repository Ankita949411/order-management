import type { Order } from '@order-management/shared';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as orderApi from '../api/orderApi';
import { CartContext } from '../context/cart-context';
import { renderWithProviders } from '../test/test-utils';
import { CheckoutPage } from './CheckoutPage';

const cartItem = {
  menuItem: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Margherita Pizza',
    description: 'Classic pizza',
    priceCents: 899,
    imageUrl: 'https://example.com/pizza.jpg',
    isAvailable: true,
    createdAt: '2026-08-03T08:00:00.000Z',
    updatedAt: '2026-08-03T08:00:00.000Z'
  },
  quantity: 1
};

const createdOrder: Order = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  customerId: '550e8400-e29b-41d4-a716-446655440002',
  deliveryName: 'Ankit Sharma',
  deliveryPhone: '(415) 555-2671',
  deliveryAddress: '123 Main Street, Bengaluru',
  status: 'ORDER_RECEIVED',
  subtotalCents: 899,
  createdAt: '2026-08-03T08:00:00.000Z',
  updatedAt: '2026-08-03T08:00:00.000Z',
  items: [],
  statusHistory: []
};

function renderCheckoutWithCart(clearCart = vi.fn()) {
  return renderWithProviders(
    <CartContext.Provider
      value={{
        items: [cartItem],
        totalQuantity: 1,
        subtotalCents: 899,
        addItem: vi.fn(),
        updateQuantity: vi.fn(),
        removeItem: vi.fn(),
        clearCart
      }}
    >
      <CheckoutPage />
    </CartContext.Provider>,
    ['/checkout']
  );
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.spyOn(orderApi, 'createOrder').mockResolvedValue(createdOrder);
  });

  it('shows validation errors for missing delivery details', async () => {
    renderCheckoutWithCart();

    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number must be a valid us phone number/i)).toBeInTheDocument();
    expect(screen.getByText(/address must be at least 10 characters/i)).toBeInTheDocument();
  });

  it('submits an order and shows the success screen', async () => {
    const clearCart = vi.fn();
    renderCheckoutWithCart(clearCart);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Ankit Sharma' } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '(415) 555-2671' } });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main Street, Bengaluru' }
    });
    fireEvent.click(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(orderApi.createOrder).toHaveBeenCalledWith({
        customer: {
          name: 'Ankit Sharma',
          phone: '(415) 555-2671',
          address: '123 Main Street, Bengaluru'
        },
        items: [{ menuItemId: cartItem.menuItem.id, quantity: 1 }]
      });
    });
    expect(clearCart).toHaveBeenCalled();
    expect(await screen.findByText(/order placed/i)).toBeInTheDocument();
  });
});

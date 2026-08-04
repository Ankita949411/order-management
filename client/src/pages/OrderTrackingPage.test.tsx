import type { Order } from '@order-management/shared';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import * as orderApi from '../api/orderApi';
import { socketClient } from '../api/socketClient';
import { renderWithProviders } from '../test/test-utils';
import { OrderTrackingPage } from './OrderTrackingPage';

vi.mock('../api/socketClient', () => ({
  socketClient: {
    connected: true,
    connect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}));

const order: Order = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  customerId: '550e8400-e29b-41d4-a716-446655440002',
  deliveryName: 'Ankit Sharma',
  deliveryPhone: '(415) 555-2671',
  deliveryAddress: '123 Main Street, Bengaluru',
  status: 'ORDER_RECEIVED',
  subtotalCents: 899,
  createdAt: '2026-08-03T08:00:00.000Z',
  updatedAt: '2026-08-03T08:00:00.000Z',
  items: [
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      orderId: '550e8400-e29b-41d4-a716-446655440001',
      menuItemId: '550e8400-e29b-41d4-a716-446655440000',
      itemName: 'Margherita Pizza',
      itemDescription: 'Classic pizza',
      itemPriceCents: 899,
      quantity: 1,
      lineTotalCents: 899,
      createdAt: '2026-08-03T08:00:00.000Z'
    }
  ],
  statusHistory: [
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      orderId: '550e8400-e29b-41d4-a716-446655440001',
      status: 'ORDER_RECEIVED',
      changedAt: '2026-08-03T08:00:00.000Z'
    }
  ]
};

describe('OrderTrackingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(orderApi, 'getOrderById').mockResolvedValue(order);
  });

  it('renders order status and applies realtime status updates', async () => {
    let statusHandler: ((event: unknown) => void) | undefined;
    vi.mocked(socketClient.on).mockImplementation((event, handler) => {
      if (event === 'order:status-updated') {
        statusHandler = handler as (event: unknown) => void;
      }
      return socketClient;
    });

    renderWithProviders(
      <Routes>
        <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
      </Routes>,
      [`/orders/${order.id}`]
    );

    expect(await screen.findAllByText('Order Received')).toHaveLength(2);
    expect(socketClient.emit).toHaveBeenCalledWith('order:subscribe', { orderId: order.id });

    statusHandler?.({
      orderId: order.id,
      status: 'PREPARING',
      updatedAt: '2026-08-03T08:01:00.000Z'
    });

    await waitFor(() => {
      expect(screen.getByText('Preparing')).toBeInTheDocument();
    });
  });
});

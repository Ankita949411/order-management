import { AppError } from '../middleware/error-handler';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '@order-management/shared';

const createOrderRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  updateStatus: jest.fn()
});

const createMenuRepository = () => ({
  findAvailable: jest.fn(),
  findAvailableByIds: jest.fn()
});

const createRealtimeService = () => ({
  attach: jest.fn(),
  registerSocket: jest.fn(),
  emitStatusUpdated: jest.fn()
});

const createStatusScheduler = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  stopAll: jest.fn()
});

describe('OrderService', () => {
  it('creates an order using menu item snapshots and calculated totals', async () => {
    const orderRepository = createOrderRepository();
    const menuRepository = createMenuRepository();
    const realtimeService = createRealtimeService();
    const statusScheduler = createStatusScheduler();

    menuRepository.findAvailableByIds.mockResolvedValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Margherita Pizza',
        description: 'Classic pizza',
        priceCents: 899
      }
    ]);
    orderRepository.create.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440001',
      status: OrderStatus.ORDER_RECEIVED,
      updatedAt: new Date('2026-08-03T08:00:00.000Z')
    });

    const service = new OrderService(
      orderRepository,
      menuRepository,
      realtimeService,
      statusScheduler
    );

    await service.createOrder({
      customer: {
        name: 'Ankit Sharma',
        phone: '(415) 555-2671',
        address: '123 Main Street, Bengaluru'
      },
      items: [
        {
          menuItemId: '550e8400-e29b-41d4-a716-446655440000',
          quantity: 2
        }
      ]
    });

    expect(orderRepository.create).toHaveBeenCalledWith({
      customer: {
        name: 'Ankit Sharma',
        phone: '(415) 555-2671',
        address: '123 Main Street, Bengaluru'
      },
      subtotalCents: 1798,
      items: [
        {
          menuItemId: '550e8400-e29b-41d4-a716-446655440000',
          itemName: 'Margherita Pizza',
          itemDescription: 'Classic pizza',
          itemPriceCents: 899,
          quantity: 2,
          lineTotalCents: 1798
        }
      ]
    });
    expect(realtimeService.emitStatusUpdated).toHaveBeenCalledWith({
      orderId: '550e8400-e29b-41d4-a716-446655440001',
      status: OrderStatus.ORDER_RECEIVED,
      updatedAt: '2026-08-03T08:00:00.000Z'
    });
    expect(statusScheduler.start).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001');
  });

  it('rejects unavailable menu items', async () => {
    const orderRepository = createOrderRepository();
    const menuRepository = createMenuRepository();
    const realtimeService = createRealtimeService();
    const statusScheduler = createStatusScheduler();
    menuRepository.findAvailableByIds.mockResolvedValue([]);

    const service = new OrderService(
      orderRepository,
      menuRepository,
      realtimeService,
      statusScheduler
    );

    await expect(
      service.createOrder({
        customer: {
          name: 'Ankit Sharma',
          phone: '(415) 555-2671',
          address: '123 Main Street, Bengaluru'
        },
        items: [
          {
            menuItemId: '11111111-1111-1111-1111-111111111111',
            quantity: 1
          }
        ]
      })
    ).rejects.toThrow(AppError);
  });

  it('merges duplicate menu items before creating an order', async () => {
    const orderRepository = createOrderRepository();
    const menuRepository = createMenuRepository();
    const realtimeService = createRealtimeService();
    const statusScheduler = createStatusScheduler();

    menuRepository.findAvailableByIds.mockResolvedValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Margherita Pizza',
        description: 'Classic pizza',
        priceCents: 899
      }
    ]);
    orderRepository.create.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440001',
      status: OrderStatus.ORDER_RECEIVED,
      updatedAt: new Date('2026-08-03T08:00:00.000Z')
    });

    const service = new OrderService(
      orderRepository,
      menuRepository,
      realtimeService,
      statusScheduler
    );

    await service.createOrder({
      customer: {
        name: 'Ankit Sharma',
        phone: '(415) 555-2671',
        address: '123 Main Street, Bengaluru'
      },
      items: [
        { menuItemId: '550e8400-e29b-41d4-a716-446655440000', quantity: 1 },
        { menuItemId: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 }
      ]
    });

    expect(orderRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotalCents: 2697,
        items: [
          expect.objectContaining({
            menuItemId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 3,
            lineTotalCents: 2697
          })
        ]
      })
    );
  });

  it('rejects invalid status transitions', async () => {
    const orderRepository = createOrderRepository();
    const menuRepository = createMenuRepository();
    const realtimeService = createRealtimeService();
    const statusScheduler = createStatusScheduler();
    orderRepository.findById.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440000',
      status: OrderStatus.DELIVERED
    });

    const service = new OrderService(
      orderRepository,
      menuRepository,
      realtimeService,
      statusScheduler
    );

    await expect(
      service.updateOrderStatus('550e8400-e29b-41d4-a716-446655440000', OrderStatus.PREPARING)
    ).rejects.toThrow(AppError);
  });
});

import { OrderStatus } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../config/prisma';
import { orderStatusSchedulerService } from '../services/order-status-scheduler.service';

jest.mock('../config/prisma', () => ({
  prisma: {
    menuItem: {
      findMany: jest.fn()
    },
    order: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    },
    customer: {
      create: jest.fn()
    },
    orderStatusHistory: {
      create: jest.fn()
    },
    $transaction: jest.fn()
  }
}));

const app = createApp();
const menuItem = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Margherita Pizza',
  description: 'Classic pizza',
  priceCents: 899,
  imageUrl: 'https://example.com/pizza.jpg',
  isAvailable: true,
  createdAt: new Date('2026-08-03T08:00:00.000Z'),
  updatedAt: new Date('2026-08-03T08:00:00.000Z')
};
const order = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  customerId: '550e8400-e29b-41d4-a716-446655440002',
  deliveryName: 'Ankit Sharma',
  deliveryPhone: '9876543210',
  deliveryAddress: '123 Main Street, Bengaluru',
  status: OrderStatus.ORDER_RECEIVED,
  subtotalCents: 899,
  createdAt: new Date('2026-08-03T08:00:00.000Z'),
  updatedAt: new Date('2026-08-03T08:00:00.000Z'),
  customer: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Ankit Sharma',
    phone: '9876543210',
    createdAt: new Date('2026-08-03T08:00:00.000Z'),
    updatedAt: new Date('2026-08-03T08:00:00.000Z')
  },
  items: [],
  statusHistory: []
};

describe('order management API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    orderStatusSchedulerService.stopAll();
  });

  it('GET /api/menu returns available menu items', async () => {
    jest.mocked(prisma.menuItem.findMany).mockResolvedValue([menuItem]);

    const response = await request(app).get('/api/menu');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe('Margherita Pizza');
  });

  it('POST /api/orders creates an order', async () => {
    jest.mocked(prisma.menuItem.findMany).mockResolvedValue([menuItem]);
    jest.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback({
        customer: {
          create: jest.fn().mockResolvedValue(order.customer)
        },
        order: {
          create: jest.fn().mockResolvedValue({ id: order.id }),
          findUnique: jest.fn().mockResolvedValue(order)
        },
        orderStatusHistory: {
          create: jest.fn().mockResolvedValue({})
        }
      } as never)
    );

    const response = await request(app)
      .post('/api/orders')
      .send({
        customer: {
          name: 'Ankit Sharma',
          phone: '9876543210',
          address: '123 Main Street, Bengaluru'
        },
        items: [{ menuItemId: menuItem.id, quantity: 1 }]
      });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe(order.id);
    expect(response.body.data.subtotalCents).toBe(899);
  });

  it('POST /api/orders rejects invalid orders', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        customer: {
          name: '',
          phone: '12',
          address: ''
        },
        items: []
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
  });

  it('PATCH /api/orders/:id/status updates an order status', async () => {
    jest.mocked(prisma.order.findUnique).mockResolvedValue(order);
    jest.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback({
        order: {
          update: jest.fn().mockResolvedValue({}),
          findUnique: jest.fn().mockResolvedValue({
            ...order,
            status: OrderStatus.PREPARING,
            updatedAt: new Date('2026-08-03T08:01:00.000Z')
          })
        },
        orderStatusHistory: {
          create: jest.fn().mockResolvedValue({})
        }
      } as never)
    );

    const response = await request(app)
      .patch(`/api/orders/${order.id}/status`)
      .send({ status: OrderStatus.PREPARING });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe(OrderStatus.PREPARING);
  });
});

import { OrderStatus } from '@prisma/client';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema';

describe('order schemas', () => {
  it('accepts a valid create order payload', () => {
    const result = createOrderSchema.safeParse({
      customer: {
        name: 'Ankit Sharma',
        phone: '9876543210',
        address: '123 Main Street, Bengaluru'
      },
      items: [
        {
          menuItemId: '550e8400-e29b-41d4-a716-446655440000',
          quantity: 2
        }
      ]
    });

    expect(result.success).toBe(true);
  });

  it('rejects an empty order', () => {
    const result = createOrderSchema.safeParse({
      customer: {
        name: 'Ankit Sharma',
        phone: '9876543210',
        address: '123 Main Street, Bengaluru'
      },
      items: []
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid status', () => {
    const result = updateOrderStatusSchema.safeParse({
      status: 'UNKNOWN_STATUS'
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid status', () => {
    const result = updateOrderStatusSchema.safeParse({
      status: OrderStatus.PREPARING
    });

    expect(result.success).toBe(true);
  });
});

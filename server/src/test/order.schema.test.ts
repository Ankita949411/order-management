import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema';
import { OrderStatus } from '@order-management/shared';

describe('order schemas', () => {
  it('accepts a valid create order payload', () => {
    const result = createOrderSchema.safeParse({
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

    expect(result.success).toBe(true);
  });

  it('accepts common valid US phone formats', () => {
    const validPhoneNumbers = ['4155552671', '415-555-2671', '(415) 555-2671', '+1 415 555 2671'];

    for (const phone of validPhoneNumbers) {
      const result = createOrderSchema.safeParse({
        customer: {
          name: 'Ankit Sharma',
          phone,
          address: '123 Main Street, New York'
        },
        items: [
          {
            menuItemId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 1
          }
        ]
      });

      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid US phone numbers', () => {
    const invalidPhoneNumbers = ['12345', '115-555-2671', '415-155-2671', '+91 9876543210'];

    for (const phone of invalidPhoneNumbers) {
      const result = createOrderSchema.safeParse({
        customer: {
          name: 'Ankit Sharma',
          phone,
          address: '123 Main Street, New York'
        },
        items: [
          {
            menuItemId: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 1
          }
        ]
      });

      expect(result.success).toBe(false);
    }
  });

  it('rejects an empty order', () => {
    const result = createOrderSchema.safeParse({
      customer: {
        name: 'Ankit Sharma',
        phone: '(415) 555-2671',
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

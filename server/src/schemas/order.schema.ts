import { OrderStatus } from '@order-management/shared';
import { z } from 'zod';

const usPhoneRegex = /^(?:\+1[\s.-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/;

export const orderIdParamsSchema = z.object({
  id: z.string().uuid('Order id must be a valid UUID')
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .regex(usPhoneRegex, 'Phone number must be a valid US phone number'),
    address: z.string().trim().min(10).max(500)
  }),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid('Menu item id must be a valid UUID'),
        quantity: z.number().int().positive().max(99)
      })
    )
    .min(1, 'Order must contain at least one item')
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

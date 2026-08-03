import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

export const orderIdParamsSchema = z.object({
  id: z.string().uuid('Order id must be a valid UUID')
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(32),
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

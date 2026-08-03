import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(32, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Phone number contains invalid characters'),
  address: z.string().trim().min(10, 'Address must be at least 10 characters').max(500)
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

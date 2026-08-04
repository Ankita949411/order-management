import { z } from 'zod';

const usPhoneRegex = /^(?:\+1[\s.-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/;

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  phone: z
    .string()
    .trim()
    .regex(usPhoneRegex, 'Phone number must be a valid US phone number'),
  address: z.string().trim().min(10, 'Address must be at least 10 characters').max(500)
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

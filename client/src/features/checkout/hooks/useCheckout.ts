import { useState } from 'react';
import type { Order } from '@order-management/shared';
import { getApiErrorMessage } from '../../../api/apiError';
import { createOrder } from '../../../api/orderApi';
import type { CartItem } from '../../../types/cart';
import {
  checkoutSchema,
  type CheckoutFormErrors,
  type CheckoutFormValues
} from '../schemas/checkout.schema';

const initialCheckoutValues: CheckoutFormValues = {
  name: '',
  phone: '',
  address: ''
};

type UseCheckoutParams = {
  items: CartItem[];
  clearCart: () => void;
};

export function useCheckout({ items, clearCart }: UseCheckoutParams) {
  const [formValues, setFormValues] = useState<CheckoutFormValues>(initialCheckoutValues);
  const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  function handleFieldChange(field: keyof CheckoutFormValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined
    }));
  }

  async function handleSubmit() {
    const parsedValues = checkoutSchema.safeParse(formValues);

    if (!parsedValues.success) {
      const fieldErrors = parsedValues.error.flatten().fieldErrors;
      setFormErrors({
        name: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
        address: fieldErrors.address?.[0]
      });
      return;
    }

    if (items.length === 0) {
      setSubmitError('Add at least one item before placing an order.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const order = await createOrder({
        customer: parsedValues.data,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity
        }))
      });

      clearCart();
      setCreatedOrder(order);
      setFormValues(initialCheckoutValues);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Unable to place order. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    formValues,
    formErrors,
    submitError,
    isSubmitting,
    createdOrder,
    handleFieldChange,
    handleSubmit
  };
}

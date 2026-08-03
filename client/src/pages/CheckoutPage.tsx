import { Alert, Grid, Stack, Typography } from '@mui/material';
import { CartPanel } from '../features/cart/components/CartPanel';
import { CartSummary } from '../features/cart/components/CartSummary';
import { CheckoutForm } from '../features/checkout/components/CheckoutForm';
import { OrderSuccess } from '../features/checkout/components/OrderSuccess';
import { useCheckout } from '../features/checkout/hooks/useCheckout';
import { useCart } from '../hooks/useCart';

export function CheckoutPage() {
  const { items, totalQuantity, subtotalCents, updateQuantity, removeItem, clearCart } = useCart();
  const {
    formValues,
    formErrors,
    submitError,
    isSubmitting,
    createdOrder,
    handleFieldChange,
    handleSubmit
  } = useCheckout({ items, clearCart });

  if (createdOrder) {
    return <OrderSuccess order={createdOrder} />;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Checkout
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <CartPanel
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              onClear={clearCart}
            />
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}
            <CheckoutForm
              values={formValues}
              errors={formErrors}
              isSubmitting={isSubmitting}
              disabled={items.length === 0}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary
            subtotalCents={subtotalCents}
            totalQuantity={totalQuantity}
            disabled={items.length === 0}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

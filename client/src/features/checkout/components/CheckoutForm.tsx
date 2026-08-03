import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import type {
  CheckoutFormErrors,
  CheckoutFormValues
} from '../schemas/checkout.schema';

type CheckoutFormProps = {
  values: CheckoutFormValues;
  errors: CheckoutFormErrors;
  isSubmitting: boolean;
  disabled: boolean;
  onChange: (field: keyof CheckoutFormValues, value: string) => void;
  onSubmit: () => void;
};

export function CheckoutForm({
  values,
  errors,
  isSubmitting,
  disabled,
  onChange,
  onSubmit
}: CheckoutFormProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          Delivery Details
        </Typography>
        <TextField
          label="Name"
          value={values.name}
          error={Boolean(errors.name)}
          helperText={errors.name}
          disabled={isSubmitting}
          onChange={(event) => onChange('name', event.target.value)}
          fullWidth
        />
        <TextField
          label="Phone"
          value={values.phone}
          error={Boolean(errors.phone)}
          helperText={errors.phone}
          disabled={isSubmitting}
          onChange={(event) => onChange('phone', event.target.value)}
          fullWidth
        />
        <TextField
          label="Address"
          value={values.address}
          error={Boolean(errors.address)}
          helperText={errors.address}
          disabled={isSubmitting}
          onChange={(event) => onChange('address', event.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
        <Button
          variant="contained"
          size="large"
          startIcon={<ShoppingBagIcon />}
          loading={isSubmitting}
          disabled={disabled || isSubmitting}
          onClick={onSubmit}
        >
          Place Order
        </Button>
      </Stack>
    </Paper>
  );
}

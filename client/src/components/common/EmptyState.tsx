import { Box, Typography } from '@mui/material';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      {description ? (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}

import { Alert } from '@mui/material';

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return <Alert severity="error">{message}</Alert>;
}

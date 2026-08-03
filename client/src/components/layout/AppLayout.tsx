import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

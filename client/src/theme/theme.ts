import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb'
    },
    secondary: {
      main: '#f97316'
    },
    background: {
      default: '#f8fafc'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(',')
  }
});

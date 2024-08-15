import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#37474F', // Industrial dark gray
      contrastText: '#FFFFFF', // White text for contrast
    },
    secondary: {
      main: '#607D8B', // Muted blue-gray
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#ECEFF1', // Light gray background
      paper: '#F5F5F5', // Slightly darker background for paper components
    },
    text: {
      primary: '#212121', // Dark gray for primary text
      secondary: '#757575', // Lighter gray for secondary text
    },
    error: {
        main: '#C62828', // A deeper red for error messages
      },
      warning: {
        main: '#F57C00', // A bolder orange for warnings
      },
      info: {
        main: '#0277BD', // A darker blue for informational messages
      },
      success: {
        main: '#2E7D32', // A rich green for success messages
      },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.125rem',
      fontWeight: 600,
      color: '#212121',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#212121',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#37474F',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#37474F',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#607D8B',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#607D8B',
    },
    body1: {
      fontSize: '1rem',
      color: '#212121',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#757575',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '4px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#37474F',
          color: '#FFFFFF',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '4px',
          borderRadius: 4,
          backgroundColor: '#ECEFF1',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;

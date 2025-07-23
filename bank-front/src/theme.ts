import { createTheme, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export const getBankTheme = (mode: PaletteMode): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#d32f2f',
      },
      secondary: {
        main: '#b71c1c',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#fff',
        paper: mode === 'dark' ? '#1e1e1e' : '#fff',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  }); 
import { createTheme } from '@mui/material/styles';
type PaletteMode = 'light' | 'dark';

export const createBankTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#B71C1C', // Rouge foncé
    },
    secondary: {
      main: '#D32F2F', // Rouge plus clair
    },
    background: {
      default: mode === 'dark' ? '#181818' : '#fff',
      paper: mode === 'dark' ? '#232323' : '#fff',
    },
  },
}); 
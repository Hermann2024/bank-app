import React, { useMemo, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createBankTheme } from './theme/theme';
import { BrowserRouter } from 'react-router-dom';
import { FeedbackProvider } from './components/FeedbackProvider';
// import serviceWorkerRegistration from './serviceWorkerRegistration'; // à supprimer ou commenter si non utilisé

const ColorModeContext = createContext<{ toggleColorMode: () => void; mode: PaletteMode }>({ toggleColorMode: () => {}, mode: 'light' });
export const useColorMode = () => useContext(ColorModeContext);

const Root: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    mode,
  }), [mode]);
  const theme = useMemo(() => createBankTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <FeedbackProvider>
            <App />
          </FeedbackProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals(); 
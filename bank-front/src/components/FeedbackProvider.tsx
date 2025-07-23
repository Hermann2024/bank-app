import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface FeedbackContextProps {
  showMessage: (message: string, severity?: AlertColor) => void;
}

const FeedbackContext = createContext<FeedbackContextProps>({ showMessage: () => {} });

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showMessage = (msg: string, sev: AlertColor = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <FeedbackContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}; 
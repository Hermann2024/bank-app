import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Assuming signinRedirectCallback is available globally or imported elsewhere
    // For now, we'll just navigate to the dashboard
    navigate('/dashboard');
  }, [navigate]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
};

export default Callback; 
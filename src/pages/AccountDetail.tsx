import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function AccountDetail() {
  return (
    <Box p={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">Détail du compte</Typography>
      </Paper>
    </Box>
  );
} 
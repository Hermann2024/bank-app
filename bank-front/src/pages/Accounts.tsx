import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Button } from '@mui/material';
import { apiFetch } from '../services/api';
import { getUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../components/FeedbackProvider';

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showMessage } = useFeedback();

  useEffect(() => {
    async function fetchAccounts() {
      setLoading(true);
      try {
        const user = getUser();
        if (!user) throw new Error('Utilisateur non connecté');
        const data = await apiFetch<any[]>(`/accounts/user/${encodeURIComponent(user.email)}`);
        setAccounts(data);
      } catch (e: any) {
        showMessage(e.message || 'Erreur API', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Mes comptes</Typography>
      {loading && <CircularProgress />}
      {!loading && !error && (
        <Paper sx={{ p: 2 }}>
          <List>
            {accounts.map(acc => (
              <ListItem key={acc.id} divider secondaryAction={
                <Button variant="outlined" onClick={() => navigate(`/comptes/${acc.id}`)}>
                  Détail
                </Button>
              }>
                <ListItemText
                  primary={`${acc.type} (${acc.iban})`}
                  secondary={`Solde : ${acc.balance} € | Statut : ${acc.status}`}
                />
              </ListItem>
            ))}
            {accounts.length === 0 && <Typography>Aucun compte trouvé.</Typography>}
          </List>
        </Paper>
      )}
    </Box>
  );
} 
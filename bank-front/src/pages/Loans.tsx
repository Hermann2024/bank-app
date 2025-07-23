import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { apiFetch } from '../services/api';
import { getUser } from '../services/authService';
import { useFeedback } from '../components/FeedbackProvider';

interface Loan {
  id: number;
  amount: number;
  rate: number;
  duration: number;
  status: string;
  requestDate: string;
  startDate: string;
}

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const { control, handleSubmit, reset } = useForm();
  const [userId, setUserId] = useState<string | null>(null);
  const { showMessage } = useFeedback();

  useEffect(() => {
    const user = getUser();
    if (user) {
      const id = user.email;
      setUserId(id);
      apiFetch<Loan[]>(`/loans/user/${id}`).then(data => setLoans(data));
    }
  }, []);

  const onSubmit = (data: any) => {
    apiFetch('/loans', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        amount: Number(data.amount),
        rate: Number(data.rate),
        duration: Number(data.duration),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        showMessage('Demande envoyée !', 'success');
        reset();
        if (userId) {
          apiFetch<Loan[]>(`/loans/user/${userId}`).then(data => setLoans(data));
        }
      })
      .catch(() => showMessage('Erreur lors de la demande de prêt.', 'error'));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Demander un prêt
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={4}>
        <Controller
          name="amount"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Montant (€)" type="number" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="rate"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Taux (%)" type="number" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="duration"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Durée (mois)" type="number" fullWidth margin="normal" required />
          )}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Envoyer la demande
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" color="primary" gutterBottom>
        Mes prêts
      </Typography>
      <List>
        {loans.map(loan => (
          <ListItem key={loan.id} divider>
            <ListItemText
              primary={`Prêt de ${loan.amount} € à ${loan.rate}% sur ${loan.duration} mois`}
              secondary={`Statut: ${loan.status} | Demande: ${new Date(loan.requestDate).toLocaleDateString()} | Début: ${loan.startDate ? new Date(loan.startDate).toLocaleDateString() : '-'}`}
            />
          </ListItem>
        ))}
        {loans.length === 0 && <Typography>Aucun prêt trouvé.</Typography>}
      </List>
    </Container>
  );
};

export default Loans; 
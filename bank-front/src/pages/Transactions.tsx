import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { apiFetch } from '../services/api';
import { getUser } from '../services/authService';
import { useFeedback } from '../components/FeedbackProvider';

interface Account {
  id: number;
  iban: string;
  type: string;
  balance: number;
  status: string;
}
interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  description: string;
  status: string;
}

const Transactions: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { showMessage } = useFeedback();
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    const user = getUser();
    if (user) {
      apiFetch<Account[]>(`/accounts/user/${user.email}`).then(data => setAccounts(data));
    }
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      apiFetch<Transaction[]>(`/transactions/account/${accounts[0].id}`).then(data => setTransactions(data));
    }
  }, [accounts]);

  const onSubmit = (data: any) => {
    apiFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        accountId: data.fromAccount,
        type: 'VIREMENT',
        amount: Number(data.amount),
        description: data.description,
        status: 'SUCCESS',
        toIban: data.toIban,
        date: new Date().toISOString(),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        showMessage('Virement effectué avec succès !', 'success');
        reset();
        // Refresh transactions
        apiFetch<Transaction[]>(`/transactions/account/${data.fromAccount}`).then(data => setTransactions(data));
      })
      .catch(() => showMessage('Erreur lors du virement.', 'error'));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Effectuer un virement
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={4}>
        <Controller
          name="fromAccount"
          control={control}
          defaultValue={accounts[0]?.id || ''}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Compte source"
              fullWidth
              margin="normal"
              required
            >
              {accounts.map(acc => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.iban} (Solde: {acc.balance} €)
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="toIban"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="IBAN destinataire" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="amount"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Montant (€)" type="number" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Description" fullWidth margin="normal" />
          )}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Valider le virement
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" color="primary" gutterBottom>
        Historique des transactions du compte principal
      </Typography>
      <List>
        {transactions.map(tx => (
          <ListItem key={tx.id} divider>
            <ListItemText
              primary={`${tx.type} de ${tx.amount} € le ${new Date(tx.date).toLocaleDateString()}`}
              secondary={`Description: ${tx.description} | Statut: ${tx.status}`}
            />
          </ListItem>
        ))}
        {transactions.length === 0 && <Typography>Aucune transaction trouvée.</Typography>}
      </List>
    </Container>
  );
};

export default Transactions; 
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Button, TextField, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useFeedback } from '../components/FeedbackProvider';

export default function AccountDetail() {
  const { id } = useParams();
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessage } = useFeedback();
  const [newBeneficiary, setNewBeneficiary] = useState({ name: '', iban: '' });
  // Ajout pour le virement
  const [transfer, setTransfer] = useState({ beneficiaryId: '', amount: '' });
  const [transferLoading, setTransferLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const acc = await apiFetch<any>(`/accounts/${id}`);
        setAccount(acc);
        const txs = await apiFetch<any[]>(`/transactions/account/${id}`);
        setTransactions(txs);
        const bens = await apiFetch<any[]>(`/accounts/${id}/beneficiaries`);
        setBeneficiaries(bens);
      } catch (e: any) {
        setError(e.message || 'Erreur API');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAddBeneficiary = async () => {
    if (!newBeneficiary.name || !newBeneficiary.iban) {
      showMessage('Nom et IBAN requis', 'error');
      return;
    }
    try {
      await apiFetch(`/accounts/${id}/beneficiaries`, {
        method: 'POST',
        body: JSON.stringify(newBeneficiary),
      });
      showMessage('Bénéficiaire ajouté !', 'success');
      setNewBeneficiary({ name: '', iban: '' });
      const bens = await apiFetch<any[]>(`/accounts/${id}/beneficiaries`);
      setBeneficiaries(bens);
    } catch (e: any) {
      showMessage(e.message || 'Erreur API', 'error');
    }
  };

  const handleDeleteBeneficiary = async (beneficiaryId: number) => {
    try {
      await apiFetch(`/accounts/${id}/beneficiaries/${beneficiaryId}`, { method: 'DELETE' });
      showMessage('Bénéficiaire supprimé.', 'success');
      setBeneficiaries(beneficiaries.filter((b: any) => b.id !== beneficiaryId));
    } catch (e: any) {
      showMessage(e.message || 'Erreur API', 'error');
    }
  };

  const handleTransfer = async () => {
    setConfirmOpen(false);
    if (!transfer.beneficiaryId || !transfer.amount || isNaN(Number(transfer.amount)) || Number(transfer.amount) <= 0) {
      showMessage('Sélectionnez un bénéficiaire et un montant valide', 'error');
      return;
    }
    setTransferLoading(true);
    try {
      await apiFetch(`/accounts/${id}/transfer`, {
        method: 'POST',
        body: JSON.stringify({
          beneficiaryId: transfer.beneficiaryId,
          amount: Number(transfer.amount),
        }),
      });
      showMessage('Virement effectué !', 'success');
      setTransfer({ beneficiaryId: '', amount: '' });
      // Rafraîchir transactions
      const txs = await apiFetch<any[]>(`/transactions/account/${id}`);
      setTransactions(txs);
    } catch (e: any) {
      showMessage(e.message || 'Erreur API', 'error');
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Détail du compte</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && account && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">{account.type} ({account.iban})</Typography>
            <Typography>Solde : {account.balance} €</Typography>
            <Typography>Statut : {account.status}</Typography>
          </Paper>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">Transactions</Typography>
            <List>
              {transactions.map(tx => (
                <ListItem key={tx.id} divider>
                  <ListItemText
                    primary={`${tx.type === 'CREDIT' ? '+' : '-'} ${tx.amount} € (${tx.category || tx.description})`}
                    secondary={tx.date ? tx.date.slice(0, 10) : ''}
                  />
                </ListItem>
              ))}
              {transactions.length === 0 && <Typography>Aucune transaction trouvée.</Typography>}
            </List>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Bénéficiaires</Typography>
            <List>
              {beneficiaries.map((b: any) => (
                <ListItem key={b.id} divider secondaryAction={
                  <Button color="error" onClick={() => handleDeleteBeneficiary(b.id)}>Supprimer</Button>
                }>
                  <ListItemText primary={b.name} secondary={b.iban} />
                </ListItem>
              ))}
              {beneficiaries.length === 0 && <Typography>Aucun bénéficiaire.</Typography>}
            </List>
            <Box display="flex" gap={2} mt={2} mb={2}>
              <TextField
                label="Nom du bénéficiaire"
                value={newBeneficiary.name}
                onChange={e => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                size="small"
              />
              <TextField
                label="IBAN"
                value={newBeneficiary.iban}
                onChange={e => setNewBeneficiary({ ...newBeneficiary, iban: e.target.value })}
                size="small"
              />
              <Button variant="contained" onClick={handleAddBeneficiary}>
                Ajouter
              </Button>
            </Box>
            {/* Formulaire de virement */}
            <Box display="flex" gap={2} mt={4} alignItems="center">
              <TextField
                select
                label="Bénéficiaire"
                value={transfer.beneficiaryId}
                onChange={e => setTransfer({ ...transfer, beneficiaryId: e.target.value })}
                SelectProps={{ native: true }}
                size="small"
                sx={{ minWidth: 200 }}
                inputProps={{ 'aria-label': 'Bénéficiaire' }}
              >
                <option value="">Sélectionner</option>
                {beneficiaries.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name} ({b.iban})</option>
                ))}
              </TextField>
              <TextField
                label="Montant (€)"
                type="number"
                value={transfer.amount}
                onChange={e => setTransfer({ ...transfer, amount: e.target.value })}
                size="small"
                sx={{ maxWidth: 120 }}
              />
              <Button
                variant="contained"
                onClick={() => setConfirmOpen(true)}
                disabled={transferLoading}
              >
                {transferLoading ? 'Envoi...' : 'Envoyer'}
              </Button>
              <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirmer le virement</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Confirmez-vous le virement de <b>{transfer.amount} €</b> à <b>{beneficiaries.find(b => b.id === transfer.beneficiaryId)?.name || ''}</b> ({beneficiaries.find(b => b.id === transfer.beneficiaryId)?.iban || ''}) ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
                  <Button onClick={handleTransfer} variant="contained" color="primary" disabled={transferLoading}>
                    Confirmer
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
} 
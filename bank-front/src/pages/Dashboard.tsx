import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../services/api';
import { getUser } from '../services/authService';

const COLORS = ['#d32f2f', '#b71c1c', '#f44336', '#ff7961', '#ba000d'];

export default function Dashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const user = getUser();
        if (!user) throw new Error('Utilisateur non connecté');
        // Récupérer les comptes de l'utilisateur
        const accountsData = await apiFetch<any[]>(`/accounts/user/${encodeURIComponent(user.email)}`);
        setAccounts(accountsData);
        // Récupérer les transactions du premier compte (exemple)
        if (accountsData.length > 0) {
          const txs = await apiFetch<any[]>(`/transactions/account/${accountsData[0].id}`);
          setTransactions(txs);
        } else {
          setTransactions([]);
        }
      } catch (e: any) {
        setError(e.message || 'Erreur API');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Générer les données pour les graphiques à partir des transactions
  const balanceData = transactions.reduce((acc: any[], tx: any) => {
    const date = tx.date ? tx.date.slice(0, 7) : 'Inconnu'; // YYYY-MM
    const last = acc.length > 0 ? acc[acc.length - 1].balance : 1000;
    const balance = tx.type === 'CREDIT' ? last + tx.amount : last - tx.amount;
    if (acc.length === 0 || acc[acc.length - 1].date !== date) {
      acc.push({ date, balance });
    } else {
      acc[acc.length - 1].balance = balance;
    }
    return acc;
  }, []);

  const expensesByCategory: Record<string, number> = {};
  transactions.forEach((tx: any) => {
    if (tx.type === 'DEBIT') {
      const cat = tx.category || 'Autre';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + tx.amount;
    }
  });
  const expensesData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Solde mensuel</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={balanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="balance" stroke="#d32f2f" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Dépenses par catégorie</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expensesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {expensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Comptes</Typography>
              <ul>
                {accounts.map(acc => (
                  <li key={acc.id}>{acc.type} ({acc.iban}) : {acc.balance} €</li>
                ))}
                {accounts.length === 0 && <li>Aucun compte trouvé.</li>}
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Transactions récentes</Typography>
              <ul>
                {transactions.slice(0, 5).map(tx => (
                  <li key={tx.id}>{tx.type === 'CREDIT' ? '+' : '-'} {tx.amount} € ({tx.category || tx.description}) - {tx.date ? tx.date.slice(0, 10) : ''}</li>
                ))}
                {transactions.length === 0 && <li>Aucune transaction trouvée.</li>}
              </ul>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 
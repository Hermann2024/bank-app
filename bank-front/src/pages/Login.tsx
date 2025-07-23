import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/authService';
import { useFeedback } from '../components/FeedbackProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const navigate = useNavigate();
  const { showMessage } = useFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiLogin(email, password);
      navigate('/');
    } catch (err: any) {
      showMessage(err.message || 'Erreur inconnue', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Formulaire d'inscription (mock, à adapter selon ton backend)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Remplace cette partie par un appel réel à ton endpoint d'inscription
      if (!registerEmail || !registerPassword) throw new Error('Email et mot de passe requis');
      // await apiRegister(registerEmail, registerPassword);
      showMessage('Compte créé ! Vous pouvez vous connecter.', 'success');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (err: any) {
      showMessage(err.message || 'Erreur lors de la création du compte', 'error');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        {showRegister ? (
          <>
            <Typography variant="h5" mb={2} align="center">Créer un compte</Typography>
            <form onSubmit={handleRegister}>
              <TextField
                label="Email"
                type="email"
                value={registerEmail}
                onChange={e => setRegisterEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                S’inscrire
              </Button>
            </form>
            <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => setShowRegister(false)}>
              Retour à la connexion
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" mb={2} align="center">Connexion</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
              </Button>
            </form>
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => setShowRegister(true)}
            >
              Créer un compte
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
} 
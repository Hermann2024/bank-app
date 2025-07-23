import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Divider, Alert } from '@mui/material';
import { getUser } from '../services/authService';
import { useFeedback } from '../components/FeedbackProvider';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const { showMessage } = useFeedback();

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setForm({ name: u?.name || '', email: u?.email || '' });
  }, []);

  const handleEdit = () => setEdit(true);
  const handleCancel = () => {
    setEdit(false);
    setForm({ name: user?.profile.name || '', email: user?.profile.email || '' });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    showMessage('Modifications enregistrées (mock)', 'success');
    setEdit(false);
  };
  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      showMessage('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    showMessage('Mot de passe modifié (mock)', 'success');
    setPasswords({ old: '', new: '', confirm: '' });
  };

  if (!user) return <Typography>Chargement...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Mon profil
      </Typography>
      <Box mb={2}>
        <TextField
          label="Nom"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        {edit ? (
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>Enregistrer</Button>
            <Button variant="outlined" onClick={handleCancel}>Annuler</Button>
          </Box>
        ) : (
          <Button variant="outlined" onClick={handleEdit} sx={{ mt: 2 }}>Modifier</Button>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" color="primary" gutterBottom>
        Changer de mot de passe
      </Typography>
      <TextField
        label="Ancien mot de passe"
        type="password"
        value={passwords.old}
        onChange={e => setPasswords({ ...passwords, old: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nouveau mot de passe"
        type="password"
        value={passwords.new}
        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirmer le nouveau mot de passe"
        type="password"
        value={passwords.confirm}
        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handlePasswordChange} sx={{ mt: 2 }}>
        Modifier le mot de passe
      </Button>
    </Container>
  );
};

export default Profile; 
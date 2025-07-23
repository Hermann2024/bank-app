import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Select, MenuItem, Box, Divider, Alert } from '@mui/material';
import { useFeedback } from '../components/FeedbackProvider';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@bank.com', roles: ['ADMIN'] },
  { id: 2, username: 'user1', email: 'user1@bank.com', roles: ['USER'] },
  { id: 3, username: 'user2', email: 'user2@bank.com', roles: ['USER'] },
];

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { showMessage } = useFeedback();

  useEffect(() => {
    setUsers(mockUsers); // À remplacer par un appel API réel
  }, []);

  const handleRoleChange = (id: number, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, roles: [newRole] } : u));
    showMessage('Rôle modifié (mock)', 'success');
  };
  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    showMessage('Utilisateur supprimé (mock)', 'success');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Administration - Gestion des utilisateurs
      </Typography>
      <List>
        {users.map(user => (
          <ListItem key={user.id} divider>
            <ListItemText
              primary={`${user.username} (${user.email})`}
              secondary={`Rôle : ${user.roles.join(', ')}`}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Select
                value={user.roles[0]}
                onChange={e => handleRoleChange(user.id, e.target.value as string)}
                size="small"
              >
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </Select>
              <Button color="error" onClick={() => handleDelete(user.id)}>
                Supprimer
              </Button>
            </Box>
          </ListItem>
        ))}
        {users.length === 0 && <Typography>Aucun utilisateur.</Typography>}
      </List>
      <Divider sx={{ my: 2 }} />
    </Container>
  );
};

export default Admin; 
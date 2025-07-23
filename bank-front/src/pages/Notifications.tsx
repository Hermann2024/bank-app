import React, { useEffect, useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import { Box, Typography, List, ListItemText, ListItemSecondaryAction, IconButton, Chip, TextField, Tabs, Tab, Pagination } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { getNotifications, markNotificationAsRead } from '../services/api';

interface Notification {
  id: string;
  content: string;
  date: string;
  read: boolean;
}

const PAGE_SIZE = 10;

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Filtrage et recherche
  const filtered = notifications.filter(n => {
    if (filter === 'read' && !n.read) return false;
    if (filter === 'unread' && n.read) return false;
    if (search && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Rechercher"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          size="small"
        />
        <Tabs value={filter} onChange={(_, v) => { setFilter(v); setPage(1); }}>
          <Tab value="all" label="Toutes" />
          <Tab value="unread" label="Non lues" />
          <Tab value="read" label="Lues" />
        </Tabs>
      </Box>
      <List>
        {paged.length === 0 && <Typography>Aucune notification trouvée.</Typography>}
        {paged.map(n => (
          <ListItemButton key={n.id} divider selected={!n.read}>
            <ListItemText
              primary={n.content}
              secondary={new Date(n.date).toLocaleString()}
            />
            <ListItemSecondaryAction>
              {!n.read ? (
                <IconButton edge="end" onClick={() => markAsRead(n.id)} title="Marquer comme lue">
                  <DoneIcon />
                </IconButton>
              ) : (
                <Chip label="Lue" size="small" color="success" />
              )}
            </ListItemSecondaryAction>
          </ListItemButton>
        ))}
      </List>
      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      )}
    </Box>
  );
};

export default Notifications; 
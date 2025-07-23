import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Tooltip, Snackbar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { connectWebSocket, subscribeToNotifications } from '../services/websocket';

const WS_URL = 'ws://localhost:8080/notifications'; // À adapter selon ton backend

const NotificationsBadge: React.FC = () => {
  const [unread, setUnread] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    connectWebSocket(WS_URL);
    const unsubscribe = subscribeToNotifications((msg) => {
      setUnread(u => u + 1);
      setSnackbar({ open: true, message: msg.content || 'Nouvelle notification' });
      setNotifications(prev => [
        {
          id: msg.id || Date.now().toString(),
          content: msg.content || 'Notification',
          date: msg.date || new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    setUnread(0);
    navigate('/notifications', { state: { notifications } });
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleClick} sx={{ mr: 2 }}>
          <Badge badgeContent={unread} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
};

export default NotificationsBadge; 
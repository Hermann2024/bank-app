import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { connectWebSocket, subscribeToNotifications } from '../services/websocket';
import { useFeedback } from './FeedbackProvider';

const WS_URL = 'ws://localhost:8080/notifications'; // À adapter selon ton backend

const NotificationsBadge: React.FC = () => {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  const { showMessage } = useFeedback();

  useEffect(() => {
    connectWebSocket(WS_URL);
    const unsubscribe = subscribeToNotifications((msg) => {
      setUnread(u => u + 1);
      showMessage(msg.content || 'Nouvelle notification', 'info');
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
    </>
  );
};

export default NotificationsBadge; 
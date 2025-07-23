import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box, Tooltip } from '@mui/material';
import { getUser, logout } from '../services/authService';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link as RouterLink } from 'react-router-dom';
import NotificationsBadge from './NotificationsBadge';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Banque Moderne
        </Typography>
        <NotificationsBadge />
        <Tooltip title={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}>
          <IconButton sx={{ mr: 2 }} onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        {user && (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.profile.name || user.profile.preferred_username}
            </Typography>
            <IconButton onClick={handleMenu} color="inherit">
              {user.profile.picture ? (
                <Avatar src={user.profile.picture} />
              ) : (
                <AccountCircle fontSize="large" />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>Profil</MenuItem>
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, IconButton, useTheme, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Comptes', icon: <AccountBalanceIcon />, path: '/accounts' },
  { text: 'Transactions', icon: <SwapHorizIcon />, path: '/transactions' },
  { text: 'Cartes', icon: <CreditCardIcon />, path: '/cards' },
  { text: 'Prêts', icon: <MonetizationOnIcon />, path: '/loans' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => false}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: theme.zIndex.drawer + 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar; 
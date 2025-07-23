import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import { ThemeProvider, CssBaseline, IconButton, Drawer, List, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Box, Tooltip } from '@mui/material';
import { getBankTheme } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import { isAuthenticated, logout as doLogout, getUser } from './services/authService';
import AccountDetail from './pages/AccountDetail';
import Notifications from './pages/Notifications';

function Home() {
  return <Box p={3}><Typography variant="h4">Accueil</Typography></Box>;
}
function Accounts() {
  return <Box p={3}><Typography variant="h4">Comptes</Typography></Box>;
}
function Transactions() {
  return <Box p={3}><Typography variant="h4">Transactions</Typography></Box>;
}
function Profile() {
  return <Box p={3}><Typography variant="h4">Profil</Typography></Box>;
}

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Accueil', icon: <HomeIcon />, path: '/' },
  { text: 'Comptes', icon: <AccountBalanceIcon />, path: '/comptes' },
  { text: 'Transactions', icon: <SwapHorizIcon />, path: '/transactions' },
  { text: 'Profil', icon: <AccountBoxIcon />, path: '/profil' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

function PrivateRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [open, setOpen] = useState(false);
  const theme = getBankTheme(mode);
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    doLogout();
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLogin && (
        <>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Banque Moderne
              </Typography>
              {user && (
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {user.email}
                </Typography>
              )}
              <Tooltip title="Changer de mode">
                <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit">
                  {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Déconnexion">
                <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
              <List>
                {navItems.map((item) => (
                  <ListItemButton key={item.text} component={Link} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>
        </>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/comptes" element={<PrivateRoute><Accounts /></PrivateRoute>} />
        <Route path="/comptes/:id" element={<PrivateRoute><AccountDetail /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        <Route path="/profil" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 
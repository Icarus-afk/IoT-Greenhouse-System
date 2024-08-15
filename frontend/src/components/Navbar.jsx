import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const ws = new WebSocket(`ws://127.0.0.1:8001/ws/notifications/?token=${token}`);

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setNotifications((prevNotifications) => [...prevNotifications, message]);
        setUnreadCount((prevCount) => prevCount + 1);
      };

      return () => {
        ws.close();
      };
    }
  }, []);

  useEffect(() => {
    setUnreadCount(0);
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserInfoClick = () => {
    navigate('/user-info');
    handleClose();
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
    navigate('/login');
  };

  const handleTitleClick = () => {
    navigate('/home');
  };

  const handleNotificationsClick = () => {
    setOpenDialog(true);
    setUnreadCount(0);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleViewAllNotifications = () => {
    setOpenDialog(false);
    navigate('/notifications');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={handleTitleClick}
        >
          Greenhouse Monitoring Dashboard
        </Typography>
        <IconButton color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={unreadCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {isAuthenticated && (
          <div>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileClick}
              sx={{ mr: 2 }}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  width: '200px',
                },
              }}
            >
              <MenuItem onClick={handleUserInfoClick}>User Info</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index}>
                <ListItemText primary={notification.message} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewAllNotifications} color="primary">
            View All Notifications
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
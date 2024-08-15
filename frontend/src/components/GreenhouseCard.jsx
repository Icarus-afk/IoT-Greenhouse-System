import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Divider, Chip,
  Drawer, IconButton, List, ListItem, ListItemText, Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const GreenhouseCard = ({ greenhouse }) => {
  const { name, location, device, crop, timestamp } = greenhouse;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isOnline = device.is_online ? 'Online' : 'Offline';
  const lastSeen = device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A';

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <Card sx={{
        maxWidth: 360,
        m: 2,
        borderRadius: 4,
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        transition: '0.3s',
        backgroundColor: '#f5f5f5',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.2)',
        },
      }} onClick={toggleDrawer}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
            {name}
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#ddd' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ color: 'primary.main', fontSize: 30, mr: 1 }} />
            <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 500 }}>
              {location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DeviceHubIcon sx={{ color: 'primary.main', fontSize: 30, mr: 1 }} />
            <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 500 }}>
              {device.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ color: 'primary.main', fontSize: 30, mr: 1 }} />
            <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 500 }}>
              Last Seen: {lastSeen}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              label={isOnline}
              color={isOnline === 'Online' ? 'success' : 'error'}
              icon={<CircleIcon />}
              sx={{ mr: 1 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AgricultureIcon sx={{ color: 'primary.main', fontSize: 30, mr: 1 }} />
            <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 500 }}>
              Crop: {crop.name}
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary">
            Last Update: {new Date(timestamp).toLocaleString()}
          </Typography>

          {/* Expand/Collapse Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <IconButton>
              {drawerOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Detailed Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Greenhouse Name" secondary={name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Location" secondary={location} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Device Name" secondary={device.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Device Location" secondary={device.location} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Last Seen" secondary={lastSeen} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Crop" secondary={crop.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Last Update" secondary={new Date(timestamp).toLocaleString()} />
            </ListItem>
          </List>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={toggleDrawer}>
            Close
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default GreenhouseCard;
